from models.db import db
from sqlalchemy.exc import SQLAlchemyError
from flask import jsonify

class SizeTier(db.Model): 
    __tablename__ = "size_tier"
    
    id =  db.Column(db.Integer, primary_key = True) 
    size_tier = db.Column(db.String(50), nullable = False) 
    
    def __init__(self, size_tier): 
        self.size_tier = size_tier
        
    @classmethod 
    def populate_prefilled_values(cls):
        if db.session.query(cls).first():
            print("Size tiers already populated. Skipping.")
            return
        else: 
            toy = SizeTier("Toy")
            mini = SizeTier("Mini")
            standard = SizeTier("Standard")
            giant = SizeTier("Giant")
            try: 
                db.session.add(toy)
                db.session.add(mini)
                db.session.add(standard)
                db.session.add(giant)
                db.session.commit()
                print("Prefilled values for size tiers.")
            except SQLAlchemyError as e:
                db.session.rollback()
                print(f"Error inserting prefilled size tiers on app start: {e}")
            except Exception as e: 
                db.session.rollback()
                print(f"Error inserting prefilled size tiers on app start:: {e}")


    @classmethod 
    def get_size_tiers(cls):
        try: 
            size_tiers = db.session.query(SizeTier).all()
            
            # Prepare data
            size_tier_data = [
                {
                    "size_tier_id": size.id, 
                    "size_tier": size.size_tier
                }
                for size in size_tiers 
            ]
            
            return jsonify({
                "success": 1, 
                "data": size_tier_data
            }) 
    
        except SQLAlchemyError as e: 
            db.session.rollback()
            print(f"Database error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to get all size tiers. Database error"}), 500,
            )    
        except Exception as e: 
            db.session.rollback()
            print(f"Unknown error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to get all size tiers. Unknown error"}), 500, 
            )

    @classmethod 
    def create_new_size_tier(cls, new_size_tier):
        try: 
            new_size_tier = cls(new_size_tier)
            db.session.add(new_size_tier)
            db.session.commit()
            return jsonify({
                "success": 1, 
                "message": "Size tier created succesfully",
                "size_tier_id": new_size_tier.id
            })       
        except SQLAlchemyError as e:
            db.session.rollback()
            print(f"Database error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to create size tier. Database error"}), 500,
            )
        except Exception as e: 
            db.session.rollback()
            print(f"Unknown error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to create size tier. Unknown error"}), 500,
            )  
            
    @classmethod 
    def delete_size_tier(cls, size_tier_id):
        try: 
            size_tier = cls.query.filter_by(id=size_tier_id).first()

            if not size_tier:
                db.session.rollback()
                return jsonify({
                    "success": 0, 
                    "error": "Size tier not found for specified id",
                })
                
            db.session.delete(size_tier)
            db.session.commit()
            return jsonify({
                "success": 1, 
                "message": "Size tier deleted succesfully",
            })
    
        except SQLAlchemyError as e: 
            db.session.rollback()
            print(f"Database error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to delete size tier. Database error"}), 500,
            )    
    
        except Exception as e: 
            db.session.rollback()
            print(f"Unknown error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to delete size tier. Unknown error"}), 500, 
            ) 