# ig-god

IG-God is an instagram scraper of epic proportions.

## Supported queries:

FIND_PROFILE_PICS_IN_LOCATION

FIND_MACDADDIES_OF_THEME_IN_LOCATION

FIND_USERS_WHO_FOLLOW

FIND_WHO_USER_FOLLOWS

FIND_BY_USERNAME

RATE_INFLUENCER

## Examples:

```import sys
import os

root_path = os.path.abspath('.')
sys.path.append(root_path + '/' + 'instagod')  # add path to other python source

from ig_voyager import *
query_type = QueryType.FIND_BY_USERNAME
voyager = IGVoyager()
voyager.lookup_profiles(QueryType.FIND_BY_USERNAME, False, usernames=['markie1706', 'mackinzie_dae', 'pavii_padukone', 'velvetcoke', 'kupalniki_vip_v_nalichii', 'sammiswar', 'joachim_van_der_vlugt'])
```
