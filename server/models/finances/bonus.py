from models.db import db 
from datetime import datetime

class Bonus(db.Model):
    __tablename__ = "bonus"
    
    id = db.Column(db.Integer, primary_key = True) 
    employee_id =  db.Column(db.Integer, db.ForeignKey('employee.id'), nullable=False)
    bonus = db.Column(db.Numeric(precision=10, scale=2), nullable=True)
    bonus_date = db.Column(db.DateTime, nullable=False)


    def __init__():
        pass