from models.db import db
from sqlalchemy.exc import SQLAlchemyError
from flask import jsonify

class HairLength(db.Model):
    __tablename__ = "hair_length"

    id = db.Column(db.Integer, primary_key = True)  
    length = db.Column(db.String(50), nullable = False)  
    
    def __init__(self, length):
        self.length = length 
        
    @classmethod 
    def populate_prefilled_values(cls):
        if db.session.query(cls).first():
            print("Hair lengths already populated. Skipping.")
            return
        else: 
            very_short = HairLength("Very short")
            short = HairLength("Short")
            medium = HairLength("Medium")
            long = HairLength("Long")
            very_long = HairLength("Very long")

            try: 
                db.session.add(very_short)
                db.session.add(short)
                db.session.add(medium)
                db.session.add(long)
                db.session.add(very_long)
                db.session.commit()
                print("Prefilled values for hair length.")
            except SQLAlchemyError as e:
                db.session.rollback()
                print(f"Error inserting prefilled hair length on app start: {e}")
            except Exception as e: 
                db.session.rollback()
                print(f"Error inserting prefilled hair length on app start:: {e}")
                

    @classmethod 
    def get_hair_lengths(cls):
        try: 
            hair_lengths = db.session.query(HairLength).all()
            
            # Prepare data
            hair_length_data = [
                {
                    "hair_length_id": length.id, 
                    "length": length.length
                }
                for length in hair_lengths 
            ]
            
            return jsonify({
                "success": 1, 
                "data": hair_length_data
            }) 
    
        except SQLAlchemyError as e: 
            db.session.rollback()
            print(f"Database error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to get all hair lengths. Database error"}), 500,
            )    
        except Exception as e: 
            db.session.rollback()
            print(f"Unknown error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to get all hair lengths. Unknown error"}), 500, 
            )

    @classmethod 
    def create_new_hair_length(cls, new_length):
        try: 
            new_length = cls(new_length)
            db.session.add(new_length)
            db.session.commit()
            return jsonify({
                "success": 1, 
                "message": "Hair length created succesfully",
                "hair_length_id": new_length.id
            })       
        except SQLAlchemyError as e:
            db.session.rollback()
            print(f"Database error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to create hair length. Database error"}), 500,
            )
        except Exception as e: 
            db.session.rollback()
            print(f"Unknown error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to create hair length. Unknown error"}), 500,
            )  
            
    @classmethod 
    def delete_hair_length(cls, hair_length_id):
        try: 
            hair_length = cls.query.filter_by(id=hair_length_id).first()

            if not hair_length:
                db.session.rollback()
                return jsonify({
                    "success": 0, 
                    "error": "Hair length not found for specified id",
                })
                
            db.session.delete(hair_length)
            db.session.commit()
            return jsonify({
                "success": 1, 
                "message": "Hair length deleted succesfully",
            })
    
        except SQLAlchemyError as e: 
            db.session.rollback()
            print(f"Database error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to delete hair length. Database error"}), 500,
            )    
    
        except Exception as e: 
            db.session.rollback()
            print(f"Unknown error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to delete hair length. Unknown error"}), 500, 
            ) 