from models.db import db 

class PetProblems(db.Model):
    
    __tablename__="pet_problems"
    
    id = db.Column(db.Integer, primary_key = True)
    
    pet_id = db.Column(db.Integer, db.ForeignKey('pets.id'), nullable=True)  
    pet = db.relationship('Pet', backref='homework', lazy='select')

    problem = db.Column(db.Text) 
    solution = db.Column(db.Text) 

    def __init__(self, pet_id, problem, solution=None): 
        self.pet_id = pet_id
        self.problem = problem
        self.solution = solution