from models.db import db 
from sqlalchemy.exc import SQLAlchemyError
from flask import jsonify

class CoatTypes(db.Model): 
    
    __tablename__="coat_types"
    
    id = db.Column(db.Integer, primary_key = True)  
    coat_type = db.Column(db.String(50), nullable = False)  
    
    def __init__(self, coat_type):
        self.coat_type = coat_type
        
    @classmethod 
    def populate_prefilled_values(cls):
        if db.session.query(cls).first():
            print("Coat types already populated. Skipping.")
            return
        else: 
            double_coated = CoatTypes("Double coated")
            curly_coat = CoatTypes("Curly coat")
            wire_coat = CoatTypes("Wire coat")
            single_coat = CoatTypes("Single coat")

            try: 
                db.session.add(double_coated)
                db.session.add(single_coat)
                db.session.add(curly_coat)
                db.session.add(wire_coat)
                db.session.commit()
                print("Prefilled values for coat types.")
            except SQLAlchemyError as e:
                db.session.rollback()
                print(f"Error inserting prefilled coat types on app start: {e}")
            except Exception as e: 
                db.session.rollback()
                print(f"Error inserting prefilled coat types on app start:: {e}")
           