from database import es
from influencer import *
index = 'sapie'
doc_type = 'influencer'
gg = Influencer.list()
print(len(gg))
