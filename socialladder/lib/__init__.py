import os
import sys


def add_lib_path():
    lib_directory = os.path.dirname(os.path.abspath(__file__))
    if lib_directory not in sys.path:
        sys.path.insert(0, lib_directory)
        sys.path.append('/srv/socialladder')
