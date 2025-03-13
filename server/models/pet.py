"""_summary_
    Each pet has a foreign key to client 
"""

class Pet:  

    def __init__(self, name, client_id, breed_id=None, age=None, notes=None):
        self.name = name 
        self.client_id = client_id
        self.breed_id = breed_id
        self.age = age 
        self.notes = notes 
        
    @classmethod 
    def createPet(cls, name, client_id, breed_id=None, age=None, notes=None):
        return 
    
    @classmethod
    def showPetsForClient(cls, client_id):
        return 
    
    @classmethod 
    def showAllPets(cls):
        return 
    
    @classmethod 
    def editPet(cls, pet_id):
        return 
    
    @classmethod
    def deletePet(cls, pet_id):
        return 
    
    @classmethod 
    def archivePet(cls, pet_id, description): 
        return # archive pet for service pausing 