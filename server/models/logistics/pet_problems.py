from models.db import db 
from models.organisms.pet import Pet
from sqlalchemy.exc import SQLAlchemyError
from flask import jsonify

class PetProblems(db.Model):
    
    __tablename__="pet_problems"
    
    id = db.Column(db.Integer, primary_key = True)
    
    pet_id = db.Column(db.Integer, db.ForeignKey('pets.id'), nullable=True)  
    pet = db.relationship('Pet', back_populates='pet_problems', lazy='select')

    problem = db.Column(db.Text) 
    solution = db.Column(db.Text) 

    __table_args__ = (
        db.Index('idx_pet_problems_id', 'pet_id'),
    )
    def __init__(self, pet_id, problem, solution=None): 
        self.pet_id = pet_id
        self.problem = problem
        self.solution = solution
        

    @classmethod 
    def add_pet_problem(cls, pet_id, problem, solution):
        try:  
            pet = Pet.query.filter_by(id=pet_id).first()
            if not pet: 
                return jsonify({
                    "success": 0, 
                    "error": "No pet found for pet id: " + pet_id, 
                }) 
                
            pet_problem = cls(pet_id, problem, solution)
            db.session.add(pet_problem)
            db.session.commit()
            return jsonify({
                "success": 1, 
                "message": "Pet problem created succesfully",
                "pet_problem_id": pet_problem.id
            })
        except SQLAlchemyError as e: 
            db.session.rollback()
            print(f"Database error: {e}")
            return (
            jsonify({"success": 0, "error": "Failed to add pet problem. Database error"}), 500,
            )    
        except Exception as e: 
            db.session.rollback()
            print(f"Unknown error: {e}")
            return (
            jsonify({"success": 0, "error": "Failed to add pet problem. Unknown error"}), 500, 
            )   