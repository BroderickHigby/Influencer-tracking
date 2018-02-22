class target_demographic:
	follower_tags = []	
	
	def __init__ (self,age=None,gender=None,income=None,political_affiliation=None,follower_tags=[],country=None,state=None):
		self.age = age #placed into buckets
		self.gender = gender #Male,Female,Non-Binary
		self.income = income #Placed into Buckets
		self.political_affiliation = political_affiliation #liberal,conservative,moderate
		self.country = country #Country
		self.state = state #State
		self.follower_tags = follower_tags #What interests of followers the client is looking for
