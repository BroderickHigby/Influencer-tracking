import uuid

class company:
	companies = {} #static instance variable which will be a dictionary of all the companies

	def __init__(self,name,products=[],industries=[]):
		self.name = name #name of the company (example:alphabet)
		self.id = uuid.uuid4() #unique user
		self.products = products #products the company sells
		self.industries = industries #a list of the industries the company is in
		
		if name not in companies:
			self.companies[name] = self.id #adds id to dictionary, which name maps from
		else:
			old_value = self.companies[name] 
			
		
			if type(old_value) is list:
				#if more than one value already existed with this name
				#then add another id to it
				(self.companies[name]).append(self.id)
			else:
				#list of ids linked to this, each id represents a different company
				self.companies[name] = [old_value,self.id]
