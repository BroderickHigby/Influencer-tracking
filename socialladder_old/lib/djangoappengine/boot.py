import logging
import os
import sys

def find_project_dir():
    """
        Go through the path, and look for app.yaml
    """
    for path in sys.path:
        abs_path = os.path.join(os.path.abspath(path), "app.yaml")
        if os.path.exists(abs_path):
            return os.path.dirname(abs_path)

    raise RuntimeError("Unable to locate app.yaml on sys.path")

PROJECT_DIR = find_project_dir()
DATA_ROOT = os.path.join(PROJECT_DIR, '.gaedata')

# Overrides for os.environ.
env_ext = {}
if 'DJANGO_SETTINGS_MODULE' not in os.environ:
    env_ext['DJANGO_SETTINGS_MODULE'] = 'settings'


def setup_env(dev_appserver_version=1):
    """Configures GAE environment for command-line apps."""

    if dev_appserver_version not in (1, 2):
        raise Exception('Invalid dev_appserver_version setting, expected 1 or 2, got %s' % dev_appserver_version)

    # Try to import the appengine code from the system path.
    try:
        from google.appengine.api import apiproxy_stub_map
    except ImportError:
        for k in [k for k in sys.modules if k.startswith('google')]:
            del sys.modules[k]

        # Not on the system path. Build a list of alternative paths
        # where it may be. First look within the project for a local
        # copy, then look for where the Mac OS SDK installs it.
        paths = [os.path.join(PROJECT_DIR, 'google_appengine'),
                 os.environ.get('APP_ENGINE_SDK'),
                 '/usr/local/google_appengine',
                 '/usr/local/opt/google-app-engine/share/google-app-engine',
                 '/Applications/GoogleAppEngineLauncher.app/Contents/Resources/GoogleAppEngine-default.bundle/Contents/Resources/google_appengine']
        for path in os.environ.get('PATH', '').split(os.pathsep):
            path = path.rstrip(os.sep)
            if path.endswith('google_appengine'):
                paths.append(path)
        if os.name in ('nt', 'dos'):
            path = r'%(PROGRAMFILES)s\Google\google_appengine' % os.environ
            paths.append(path)

        # Loop through all possible paths and look for the SDK dir.
        sdk_path = None
        for path in paths:
            if not path:
                continue
            path = os.path.expanduser(path)
            path = os.path.realpath(path)
            if os.path.exists(path):
                sdk_path = path
                break

        # The SDK could not be found in any known location.
        if sdk_path is None:
            sys.stderr.write("The Google App Engine SDK could not be found!\n"
                             "Make sure it's accessible via your PATH "
                             "environment and called google_appengine.\n")
            sys.exit(1)

        # First add the found SDK to the path
        sys.path = [ sdk_path ] + sys.path

        # Then call fix_sys_path from the SDK
        try:
            from dev_appserver import fix_sys_path
        except ImportError:
            from old_dev_appserver import fix_sys_path

        if dev_appserver_version == 2:
            # emulate dev_appserver._run_file in devappserver2
            from dev_appserver import _PATHS
            sys.path = _PATHS._script_to_paths['dev_appserver.py'] + sys.path
        fix_sys_path()

    setup_project(dev_appserver_version)

    from djangoappengine.utils import have_appserver
    if have_appserver:
        # App Engine's threading.local is broken.
        setup_threading()
    elif not os.path.exists(DATA_ROOT):
        os.mkdir(DATA_ROOT)
    setup_logging()

    if not have_appserver:
        # Patch Django to support loading management commands from zip
        # files.
        from django.core import management
        management.find_commands = find_commands


def find_commands(management_dir):
    """
    Given a path to a management directory, returns a list of all the
    command names that are available.
    This version works for django deployments which are file based or
    contained in a ZIP (in sys.path).

    Returns an empty list if no commands are defined.
    """
    import pkgutil
    return [modname for importer, modname, ispkg in pkgutil.iter_modules(
                [os.path.join(management_dir, 'commands')]) if not ispkg]


def setup_threading():
    if sys.version_info >= (2, 7):
        return
    # XXX: On Python 2.5 GAE's threading.local doesn't work correctly
    #      with subclassing.
    try:
        from django.utils._threading_local import local
        import threading
        threading.local = local
    except ImportError:
        pass


def setup_logging():
    # Fix Python 2.6 logging module.
    logging.logMultiprocessing = 0

    # Set logging level to INFO when running in non-debug mode
    from djangoappengine.utils import have_appserver
    if have_appserver:
        # We can't import settings at this point when running a normal
        # manage.py command because this module gets imported from
        # settings.py.
        from django.conf import settings
        if not settings.DEBUG:
            logging.getLogger().setLevel(logging.INFO)

def setup_project(dev_appserver_version):
    from djangoappengine.utils import have_appserver, on_production_server
    if have_appserver:
        # This fixes a pwd import bug for os.path.expanduser().
        env_ext['HOME'] = PROJECT_DIR

    # The dev_appserver creates a sandbox which restricts access to
    # certain modules and builtins in order to emulate the production
    # environment. Here we get the subprocess module back into the
    # dev_appserver sandbox. This module is just too important for
    # development. Also we add the compiler/parser module back and
    # enable https connections (seem to be broken on Windows because
    # the _ssl module is disallowed).
    if not have_appserver and dev_appserver_version == 1:
        try:
            from google.appengine.tools import dev_appserver
        except ImportError:
            from google.appengine.tools import old_dev_appserver as dev_appserver

        try:
            # Backup os.environ. It gets overwritten by the
            # dev_appserver, but it's needed by the subprocess module.
            env = dev_appserver.DEFAULT_ENV
            dev_appserver.DEFAULT_ENV = os.environ.copy()
            dev_appserver.DEFAULT_ENV.update(env)
            # Backup the buffer() builtin. The subprocess in Python 2.5
            # on Linux and OS X uses needs it, but the dev_appserver
            # removes it.
            dev_appserver.buffer = buffer
        except AttributeError:
            logging.warn("Could not patch the default environment. "
                         "The subprocess module will not work correctly.")

        try:
            # Allow importing compiler/parser, _ssl (for https),
            # _io for Python 2.7 io support on OS X
            dev_appserver.HardenedModulesHook._WHITE_LIST_C_MODULES.extend(
                ('parser', '_ssl', '_io'))
        except AttributeError:
            logging.warn("Could not patch modules whitelist. the compiler "
                         "and parser modules will not work and SSL support "
                         "is disabled.")
    elif not on_production_server and dev_appserver_version == 1:
        try:
            try:
                from google.appengine.tools import dev_appserver
            except ImportError:
                from google.appengine.tools import old_dev_appserver as dev_appserver

            # Restore the real subprocess module.
            from google.appengine.api.mail_stub import subprocess
            sys.modules['subprocess'] = subprocess
            # Re-inject the buffer() builtin into the subprocess module.
            subprocess.buffer = dev_appserver.buffer
        except Exception, e:
            logging.warn("Could not add the subprocess module to the "
                         "sandbox: %s" % e)

    os.environ.update(env_ext)

    extra_paths = [PROJECT_DIR, os.path.join(os.path.dirname(__file__), 'lib')]
    zip_packages_dir = os.path.join(PROJECT_DIR, 'zip-packages')

    # We support zipped packages in the common and project folders.
    if os.path.isdir(zip_packages_dir):
        for zip_package in os.listdir(zip_packages_dir):
            extra_paths.append(os.path.join(zip_packages_dir, zip_package))

    # App Engine causes main.py to be reloaded if an exception gets
    # raised on the first request of a main.py instance, so don't call
    # setup_project() multiple times. We ensure this indirectly by
    # checking if we've already modified sys.path, already.
    if len(sys.path) < len(extra_paths) or \
            sys.path[:len(extra_paths)] != extra_paths:
        for path in extra_paths:
            while path in sys.path:
                sys.path.remove(path)
        sys.path = extra_paths + sys.path
