from models.db import db 

class AppointmentStats(db.Model):
    
    __tablename__="appointment_stats"
    id = db.Column(db.Integer, primary_key = True) 
    client_id = db.Column(db.Integer, db.ForeignKey('clients.id'), nullable=False) 
    
    late = db.Column(db.Integer, nullable=False, default=0)
    no_shows = db.Column(db.Integer, nullable=False, default=0)
    cancelled = db.Column(db.Integer, nullable=False, default=0)
    cancelled_late = db.Column(db.Integer, nullable=False, default=0)


    def __init__():
        pass