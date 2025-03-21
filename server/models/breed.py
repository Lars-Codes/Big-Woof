class Breed:
    
    name = None 
    
    def __init__(self, name):
        self.name = name 
        
    @classmethod     
    def create_breed(cls, name):
        pass
    
    @classmethod 
    def get_all_breeds(cls):
        pass 
    
    @classmethod 
    def update_breed_name(cls, breed_id, new_name):
        pass 
    
    def delete_breed(cls, breed_id):
        pass 