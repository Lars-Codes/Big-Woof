from models.db import db 

class Appointment(db.Model):
    
    __tablename__="appointments"
    
    id = db.Column(db.Integer, primary_key = True) 
    additional_time = db.relationship('AddedTime', backref='pet', lazy='select', foreign_keys='AddedTime.appointment_id')

    
    
    def __init__():
        pass