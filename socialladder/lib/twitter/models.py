import json
from calendar import timegm

try:
    from rfc822 import parsedate
except ImportError:
    from email.utils import parsedate

import time


class TwitterModel(object):

    """ Base class from which all twitter models will inherit. """

    def __init__(self, **kwargs):
        self.param_defaults = {}

    def __str__(self):
        """ Returns a string representation of TwitterModel. By default
        this is the same as AsJsonString(). """
        return self.AsJsonString()

    def __eq__(self, other):
        return other and self.AsDict() == other.AsDict()

    def __ne__(self, other):
        return not self.__eq__(other)

    def AsJsonString(self):
        """ Returns the TwitterModel as a JSON string based on key/value
        pairs returned from the AsDict() method. """
        return json.dumps(self.AsDict(), sort_keys=True)

    def AsDict(self):
        """ Create a dictionary representation of the object. Please see inline
        comments on construction when dictionaries contain TwitterModels. """
        data = {}

        for (key, value) in self.param_defaults.items():

            # If the value is a list, we need to create a list to hold the
            # dicts created by an object supporting the AsDict() method,
            # i.e., if it inherits from TwitterModel. If the item in the list
            # doesn't support the AsDict() method, then we assign the value
            # directly. An example being a list of Media objects contained
            # within a Status object.
            if isinstance(getattr(self, key, None), (list, tuple, set)):
                data[key] = list()
                for subobj in getattr(self, key, None):
                    if getattr(subobj, 'AsDict', None):
                        data[key].append(subobj.AsDict())
                    else:
                        data[key].append(subobj)

            # Not a list, *but still a subclass of TwitterModel* and
            # and we can assign the data[key] directly with the AsDict()
            # method of the object. An example being a Status object contained
            # within a User object.
            elif getattr(getattr(self, key, None), 'AsDict', None):
                data[key] = getattr(self, key).AsDict()

            # If the value doesn't have an AsDict() method, i.e., it's not
            # something that subclasses TwitterModel, then we can use direct
            # assigment.
            elif getattr(self, key, None):
                data[key] = getattr(self, key, None)
        return data

    @classmethod
    def NewFromJsonDict(cls, data, **kwargs):
        """ Create a new instance based on a JSON dict. Any kwargs should be
        supplied by the inherited, calling class.

        Args:
            data: A JSON dict, as converted from the JSON in the twitter API.

        """

        if kwargs:
            for key, val in kwargs.items():
                data[key] = val

        return cls(**data)


class Media(TwitterModel):

    """A class representing the Media component of a tweet. """

    def __init__(self, **kwargs):
        self.param_defaults = {
            'display_url': None,
            'expanded_url': None,
            'id': None,
            'media_url': None,
            'media_url_https': None,
            'type': None,
            'url': None,
        }

        for (param, default) in self.param_defaults.items():
            setattr(self, param, kwargs.get(param, default))

    def __repr__(self):
        return "Media(ID={media_id}, Type={media_type}, DisplayURL='{url}')".format(
            media_id=self.id,
            media_type=self.type,
            url=self.display_url)


class List(TwitterModel):

    """A class representing the List structure used by the twitter API. """

    def __init__(self, **kwargs):
        self.param_defaults = {
            'description': None,
            'following': None,
            'full_name': None,
            'id': None,
            'member_count': None,
            'mode': None,
            'name': None,
            'slug': None,
            'subscriber_count': None,
            'uri': None,
            'user': None,
        }

        for (param, default) in self.param_defaults.items():
            setattr(self, param, kwargs.get(param, default))

        if 'user' in kwargs:
            self.user = User.NewFromJsonDict(kwargs.get('user'))

    def __repr__(self):
        return "List(ID={list_id}, FullName={full_name}, Slug={slug}, User={user})".format(
            list_id=self.id,
            full_name=self.full_name,
            slug=self.slug,
            user=self.user.screen_name)


class Category(TwitterModel):

    """A class representing the suggested user category structure. """

    def __init__(self, **kwargs):
        self.param_defaults = {
            'name': None,
            'size': None,
            'slug': None,
        }

        for (param, default) in self.param_defaults.items():
            setattr(self, param, kwargs.get(param, default))

    def __repr__(self):
        return "Category(Name={name}, Slug={slug}, Size={size})".format(
            name=self.name,
            slug=self.slug,
            size=self.size)


class DirectMessage(TwitterModel):

    """A class representing a Direct Message. """

    def __init__(self, **kwargs):
        self.param_defaults = {
            'created_at': None,
            'id': None,
            'recipient_id': None,
            'recipient_screen_name': None,
            'sender_id': None,
            'sender_screen_name': None,
            'text': None,
        }

        for (param, default) in self.param_defaults.items():
            setattr(self, param, kwargs.get(param, default))

    def __repr__(self):
        if self.text and len(self.text) > 140:
            text = "{text}[...]".format(text=self.text[:140])
        else:
            text = self.text
        return "DirectMessage(ID={dm_id}, Sender={sender}, Created={time}, Text='{text}')".format(
            dm_id=self.id,
            sender=self.sender_screen_name,
            time=self.created_at,
            text=text)


class Trend(TwitterModel):

    """ A class representing a trending topic. """

    def __init__(self, **kwargs):
        self.param_defaults = {
            'events': None,
            'name': None,
            'promoted_content': None,
            'query': None,
            'timestamp': None,
            'url': None,
            'volume': None,
        }

        for (param, default) in self.param_defaults.items():
            setattr(self, param, kwargs.get(param, default))

    def __repr__(self):
        return "Trend(Name={name}, Time={ts}, URL={url})".format(
            name=self.name,
            ts=self.timestamp,
            url=self.url)


class Hashtag(TwitterModel):

    """ A class representing a twitter hashtag. """

    def __init__(self, **kwargs):
        self.param_defaults = {
            'text': None
        }

        for (param, default) in self.param_defaults.items():
            setattr(self, param, kwargs.get(param, default))

    def __repr__(self):
        return "Hashtag(Text={text})".format(
            text=self.text)


class Url(TwitterModel):

    """ A class representing an URL contained in a tweet. """

    def __init__(self, **kwargs):
        self.param_defaults = {
            'expanded_url': None,
            'url': None}

        for (param, default) in self.param_defaults.items():
            setattr(self, param, kwargs.get(param, default))

    def __repr__(self):
        return "URL(URL={url}, ExpandedURL={eurl})".format(
            url=self.url,
            eurl=self.expanded_url)


class UserStatus(TwitterModel):

    """ A class representing the UserStatus structure. This is an abbreviated
    form of the twitter.User object. """

    connections = {'following': False,
                   'followed_by': False,
                   'following_received': False,
                   'following_requested': False,
                   'blocking': False,
                   'muting': False}

    def __init__(self, **kwargs):
        self.param_defaults = {
            'blocking': False,
            'followed_by': False,
            'following': False,
            'following_received': False,
            'following_requested': False,
            'id': None,
            'id_str': None,
            'muting': False,
            'name': None,
            'screen_name': None,
        }

        for (param, default) in self.param_defaults.items():
            setattr(self, param, kwargs.get(param, default))

        if 'connections' in kwargs:
            for param in self.connections:
                if param in kwargs['connections']:
                    setattr(self, param, True)

    def __repr__(self):
        connections = [param for param in self.connections if getattr(self, param)]
        return "UserStatus(ID={uid}, ScreenName={sn}, Connections=[{conn}])".format(
            uid=self.id,
            sn=self.screen_name,
            conn=", ".join(connections))


class User(TwitterModel):

    """A class representing the User structure. """

    def __init__(self, **kwargs):
        self.param_defaults = {
            'contributors_enabled': None,
            'created_at': None,
            'default_profile': None,
            'default_profile_image': None,
            'description': None,
            'favourites_count': None,
            'followers_count': None,
            'friends_count': None,
            'geo_enabled': None,
            'id': None,
            'lang': None,
            'listed_count': None,
            'location': None,
            'name': None,
            'notifications': None,
            'profile_background_color': None,
            'profile_background_image_url': None,
            'profile_background_tile': None,
            'profile_banner_url': None,
            'profile_image_url': None,
            'profile_link_color': None,
            'profile_sidebar_fill_color': None,
            'profile_text_color': None,
            'protected': None,
            'screen_name': None,
            'status': None,
            'statuses_count': None,
            'time_zone': None,
            'url': None,
            'utc_offset': None,
            'verified': None,
        }

        for (param, default) in self.param_defaults.items():
            setattr(self, param, kwargs.get(param, default))

    def __repr__(self):
        return "User(ID={uid}, ScreenName={sn})".format(
            uid=self.id,
            sn=self.screen_name)

    @classmethod
    def NewFromJsonDict(cls, data, **kwargs):
        from twitter import Status
        if data.get('status', None):
            status = Status.NewFromJsonDict(data.get('status'))
            return super(cls, cls).NewFromJsonDict(data=data, status=status)
        else:
            return super(cls, cls).NewFromJsonDict(data=data)


class Status(TwitterModel):
    """A class representing the Status structure used by the twitter API.
    """

    def __init__(self, **kwargs):
        self.param_defaults = {
            'contributors': None,
            'coordinates': None,
            'created_at': None,
            'current_user_retweet': None,
            'favorite_count': None,
            'favorited': None,
            'geo': None,
            'hashtags': None,
            'id': None,
            'id_str': None,
            'in_reply_to_screen_name': None,
            'in_reply_to_status_id': None,
            'in_reply_to_user_id': None,
            'lang': None,
            'location': None,
            'media': None,
            'now': None,
            'place': None,
            'possibly_sensitive': None,
            'retweet_count': None,
            'retweeted': None,
            'retweeted_status': None,
            'scopes': None,
            'source': None,
            'text': None,
            'truncated': None,
            'urls': None,
            'user': None,
            'user_mentions': None,
            'withheld_copyright': None,
            'withheld_in_countries': None,
            'withheld_scope': None,
        }

        for (param, default) in self.param_defaults.items():
            setattr(self, param, kwargs.get(param, default))

    @property
    def created_at_in_seconds(self):
        """ Get the time this status message was posted, in seconds since
        the epoch (1 Jan 1970).

        Returns:
            string: The time this status message was posted, in seconds since
            the epoch.
        """
        return timegm(parsedate(self.created_at))

    @property
    def relative_created_at(self):
        """Get a human readable string representing the posting time

        Returns:
          A human readable string representing the posting time
        """
        fudge = 1.25
        delta = int(self.now) - int(self.created_at_in_seconds)

        if delta < (1 * fudge):
            return 'about a second ago'
        elif delta < (60 * (1 / fudge)):
            return 'about %d seconds ago' % (delta)
        elif delta < (60 * fudge):
            return 'about a minute ago'
        elif delta < (60 * 60 * (1 / fudge)):
            return 'about %d minutes ago' % (delta / 60)
        elif delta < (60 * 60 * fudge) or delta / (60 * 60) == 1:
            return 'about an hour ago'
        elif delta < (60 * 60 * 24 * (1 / fudge)):
            return 'about %d hours ago' % (delta / (60 * 60))
        elif delta < (60 * 60 * 24 * fudge) or delta / (60 * 60 * 24) == 1:
            return 'about a day ago'
        else:
            return 'about %d days ago' % (delta / (60 * 60 * 24))

    @property
    def Now(self):
        """Get the wallclock time for this status message.

        Used to calculate relative_created_at.  Defaults to the time
        the object was instantiated.

        Returns:
            int: Whatever the status instance believes the current time to be,
            in seconds since the epoch.
        """
        if self._now is None:
            self._now = time.time()
        return self._now

    @Now.setter
    def Now(self, now):
        self._now = now

    def __repr__(self):
        """ A string representation of this twitter.Status instance.
        The return value is the ID of status, username and datetime.

        Returns:
            string: A string representation of this twitter.Status instance with
            the ID of status, username and datetime.
        """
        if self.user:
            return "Status(ID={0}, ScreenName='{1}', Created='{2}', Text={3})".format(
                self.id,
                self.user.screen_name,
                self.created_at,
                self.text)
        else:
            return "Status(ID={0}, Created='{1}', Text={2})".format(
                self.id,
                self.created_at,
                self.text)

    @classmethod
    def NewFromJsonDict(cls, data, **kwargs):
        """ Create a new instance based on a JSON dict.

        Args:
            data: A JSON dict, as converted from the JSON in the twitter API

        Returns:
            A twitter.Status instance
        """
        current_user_retweet = None
        hashtags = None
        media = None
        retweeted_status = None
        urls = None
        user = None
        user_mentions = None

        if 'user' in data:
            user = User.NewFromJsonDict(data['user'])
        if 'retweeted_status' in data:
            retweeted_status = Status.NewFromJsonDict(data['retweeted_status'])
        if 'current_user_retweet' in data:
            current_user_retweet = data['current_user_retweet']['id']

        if 'entities' in data:
            if 'urls' in data['entities']:
                urls = [Url.NewFromJsonDict(u) for u in data['entities']['urls']]
            if 'user_mentions' in data['entities']:
                user_mentions = [User.NewFromJsonDict(u) for u in data['entities']['user_mentions']]
            if 'hashtags' in data['entities']:
                hashtags = [Hashtag.NewFromJsonDict(h) for h in data['entities']['hashtags']]
            if 'media' in data['entities']:
                media = [Media.NewFromJsonDict(m) for m in data['entities']['media']]

        # the new extended entities
        if 'extended_entities' in data:
            if 'media' in data['extended_entities']:
                media = [Media.NewFromJsonDict(m) for m in data['extended_entities']['media']]

        return super(cls, cls).NewFromJsonDict(data=data,
                                               current_user_retweet=current_user_retweet,
                                               hashtags=hashtags,
                                               media=media,
                                               retweeted_status=retweeted_status,
                                               urls=urls,
                                               user=user,
                                               user_mentions=user_mentions)
