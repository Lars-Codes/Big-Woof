"""_summary_

    Class to organize dog breeds. Holds breed name. 

"""

class Breed:
    
    breedName = None 
    
    def __init__(self, breedName="unknown"):
        self.breedName = breedName
        
    @classmethod 
    def addBreed(cls):
        return # add breed name 
    
    @classmethod 
    def getBreeds(cls):
        return # return list of breeds 
    
    @classmethod 
    def editBreed(cls, breed_id, new_name):
        return 
    
    @classmethod 
    def deleteBreed(cls, breed_id):
        return # delete breed 
    