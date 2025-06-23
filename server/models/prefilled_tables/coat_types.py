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
           


    @classmethod 
    def get_coat_types(cls):
        try: 
            coat_types = db.session.query(CoatTypes).all()
            
            # Prepare data
            coat_types_data = [
                {
                    "coat_type_id": coat.id, 
                    "coat_type": coat.coat_type
                }
                for coat in coat_types 
            ]
            
            return jsonify({
                "success": 1, 
                "data": coat_types_data
            }) 
    
        except SQLAlchemyError as e: 
            db.session.rollback()
            print(f"Database error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to get all coat types. Database error"}), 500,
            )    
        except Exception as e: 
            db.session.rollback()
            print(f"Unknown error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to get all coat types. Unknown error"}), 500, 
            )

    @classmethod 
    def create_new_coat_type(cls, new_coat_type):
        try: 
            new_coat_type = cls(new_coat_type)
            db.session.add(new_coat_type)
            db.session.commit()
            return jsonify({
                "success": 1, 
                "message": "Coat type created succesfully",
                "coat_type_id": new_coat_type.id
            })       
        except SQLAlchemyError as e:
            db.session.rollback()
            print(f"Database error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to create coat type. Database error"}), 500,
            )
        except Exception as e: 
            db.session.rollback()
            print(f"Unknown error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to create coat type. Unknown error"}), 500,
            )  
            
    @classmethod 
    def delete_coat_type(cls, coat_type_id):
        try: 
            coat_type = cls.query.filter_by(id=coat_type_id).first()

            if not coat_type:
                db.session.rollback()
                return jsonify({
                    "success": 0, 
                    "error": "Coat type not found for specified id",
                })
                
            db.session.delete(coat_type)
            db.session.commit()
            return jsonify({
                "success": 1, 
                "message": "Coat type deleted succesfully",
            })
    
        except SQLAlchemyError as e: 
            db.session.rollback()
            print(f"Database error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to delete coat type. Database error"}), 500,
            )    
    
        except Exception as e: 
            db.session.rollback()
            print(f"Unknown error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to delete coat type. Unknown error"}), 500, 
            ) 