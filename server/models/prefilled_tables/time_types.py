from models.db import db 
from sqlalchemy.exc import SQLAlchemyError

class TimeTypes(db.Model): 
    
    __tablename__="time_types"
    id = db.Column(db.Integer, primary_key = True) 
    time_type = db.Column(db.String(20), nullable = False)
    
    def __init__(self, time_type):
        self.time_type = time_type
    
    @classmethod 
    def populate_prefilled_values(cls):
        if db.session.query(cls).first():
            print("Time types already populated. Skipping.")
            return
        else: 
            minutes = TimeTypes("minutes")
            days = TimeTypes("days")
            weeks = TimeTypes("weeks")
            
            try: 
                db.session.add(minutes)
                db.session.add(days)
                db.session.add(weeks)
                db.session.commit()
                print("Prefilled values for time types.")
            except SQLAlchemyError as e:
                db.session.rollback()
                print(f"Error inserting prefilled time types on app start: {e}")
            except Exception as e: 
                db.session.rollback()
                print(f"Error inserting prefilled time types on app start:: {e}")
    
    