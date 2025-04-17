from models.db import db 

class Appointment(db.Model):
    
    __tablename__="appointments"
    
    id = db.Column(db.Integer, primary_key = True)
    client_id = db.Column(db.Integer, db.ForeignKey('clients.id'), nullable=False) 
 
    additional_time = db.relationship('AddedTime', backref='pet', lazy='select', foreign_keys='AddedTime.appointment_id')
    files = db.relationship('ClientFiles', backref='appointment', lazy='select', foreign_keys='ClientFiles.appointment_id')
    
    type = db.Column(db.String(50), nullable = False) # single, saved, or recurring
    saved_appointment_config_name = db.Column(db.String(50), nullable = True)
    
    start_recur_date = db.Column(db.DateTime, nullable=True) # REQUIRED ON FRONTEND 
    end_recur_date = db.Column(db.DateTime, nullable=True)

    date = db.Column(db.Date, nullable = True)
    start_time = db.Column(db.Time, nullable=False)
    end_time = db.Column(db.Time, nullable=False)
    
    appointment_status = db.Column(db.String(50), nullable = True) # cancelled, no-show, late, cancelled late 
    
    payment_status = db.Column(db.String(50), nullable = True) # paid, unpaid, paid late, paid partially
    payment_method = db.Column(db.String(50), nullable = True)
    
    charged = db.Column(db.Integer, nullable=True)

    __table_args__ = (
        db.Index('idx_app_type', 'type'),
        db.Index('idx_client_id_app', 'client_id'),
        db.Index("idx_date", "date")
    ) 
    # Every time we edit an appointment, make sure to update appointment stats 
    # If appointment is recurring, save a copy of it every time the appointment passes or gets edited. Option to change for all of recurring appointments or just that one. 
    # 
    def __init__():
        pass