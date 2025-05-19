from models.db import db
from sqlalchemy.exc import SQLAlchemyError

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
    