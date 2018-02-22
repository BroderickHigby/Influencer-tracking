import sys
import os

root_path = os.path.abspath('.')
sys.path.append(root_path + '/' + 'instagod')  # add path to other python source

from ig_voyager import *
voyager = IGVoyager()
#voyager.lookup_profiles(QueryType.FIND_BY_USERNAME, False, usernames=['joerogan', 'rutaenroute', 'markie1706', 'jc_shredzz', 'markmaker1706', 'jimmyjjones12121'])
#voyager.lookup_profiles(QueryType.FIND_PROFILE_PICS_IN_LOCATION, False, profile_pics=["profile.jpg", "profile2.jpg"], locations=["sandiego"])
#voyager.lookup_profiles(QueryType.RATE_INFLUENCER, False, usernames=["djadiell"], locations=["los angeles"], themes=["gym"])
#voyager.lookup_profiles(QueryType.RATE_INFLUENCER, False, usernames=["ugly.entrepreneur"], locations=["los angeles"], themes=["gym"])
#voyager.lookup_profiles(query_type, False, they_follow = ["madelynmayhem"])


#Phone/email getter test.
#Profiles: markie1706, mackinzie_dae, pavii_padukone(youtube site link in bio), velvetcoke(email in bio), kupalniki_vip_v_nalichii (phone number in bio), sammiswar (website link in bio), joachim_van_der_vlugt (email in bio)
#voyager.lookup_profiles(QueryType.FIND_BY_USERNAME, False, usernames=['markie1706', 'mackinzie_dae', 'pavii_padukone', 'velvetcoke', 'kupalniki_vip_v_nalichii', 'sammiswar', 'joachim_van_der_vlugt'])


voyager.lookup_profiles(QueryType.SEARCH_BY_INDUSTRY, False)
