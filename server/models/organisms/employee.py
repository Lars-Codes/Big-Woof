from models.db import db 
from sqlalchemy.exc import SQLAlchemyError
from flask import jsonify
from sqlalchemy.orm import joinedload

class Employee(db.Model):
    
    __tablename__ = 'employee'
    id = db.Column(db.Integer, primary_key = True) 
    fname = db.Column(db.String(50), nullable = False)
    lname = db.Column(db.String(50), nullable = False)
    notes = db.Column(db.Text)
    
    pay_per_hour = db.Column(db.Numeric(precision=10, scale=2), nullable=True)
    pay_per_appointment = db.Column(db.Numeric(precision=10, scale=2), nullable=True)
    percent_commission =  db.Column(db.Numeric(precision=10, scale=2), nullable=True)
    salary = db.Column(db.Numeric(precision=12, scale=2), nullable=True)
    overtime_rate = db.Column(db.Numeric(precision=10, scale=2), nullable=True)
    tips_received = db.Column(db.Numeric(precision=12, scale=2), nullable=True)


    contact_info_id = db.Column(db.Integer, db.ForeignKey('contact_info.id'), nullable=False)
    contact_info = db.relationship('ContactInfo', lazy='select')
    
    bonus = db.relationship('Bonus', backref='employee', lazy='select', foreign_keys='Bonus.employee_id')
  
    def __init__():
        pass
    
    @classmethod 
    def get_all_employees(cls):
        try: 
            employees = cls.query.with_entities(cls.fname, cls.lname).all()
            
            employee_data = [
                {
                    "fname": employee.fname, 
                    "lname": employee.lname, 
                } 
                for employee in employees
            ]
            
                    
            return jsonify({
                "success": 1, 
                "data": employee_data, 
            }) 
            
        except SQLAlchemyError as e: 
            db.session.rollback()
            print(f"Database error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to get employees fname and lname. Database error"}), 500,
            ) 
        except Exception as e: 
            db.session.rollback()
            print(f"Unknown error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to get employees fname and lname. Unknown error"}), 500, 
            )    