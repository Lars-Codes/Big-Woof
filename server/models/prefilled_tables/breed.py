from models.db import db

class Breed(db.Model):
    __tablename__ = "breed"

    id = db.Column(db.Integer, primary_key = True)  
    name = db.Column(db.String(50), nullable = False)  
    
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