from models.db import db 

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