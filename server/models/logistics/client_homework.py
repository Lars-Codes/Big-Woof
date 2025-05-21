from models.db import db 

class ClientHomework(db.Model):
    
    __tablename__="homework"
    
    id = db.Column(db.Integer, primary_key = True)
    
    pet_id = db.Column(db.Integer, db.ForeignKey('pets.id'), nullable=True)  
    pet = db.relationship('Pet', backref='homework', lazy='select')

    appointment_id = db.Column(db.Integer, db.ForeignKey('appointments.id'), nullable=True)  
    appointment = db.relationship('Appointment', backref='homework', lazy='select')

    homework_title = db.Column(db.String(50), nullable = False) 
    homework_notes = db.Column(db.Text, nullable=True)
    
    done = db.Column(db.Integer, default=0)
    