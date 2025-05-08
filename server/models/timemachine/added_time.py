from models.db import db

class AddedTime(db.Model):
    
    __tablename__="added_time"
    
    id = db.Column(db.Integer, primary_key = True) 
    client_id = db.Column(db.Integer, db.ForeignKey('clients.id'), nullable=True) 
    pet_id =  db.Column(db.Integer, db.ForeignKey('pets.id'), nullable=True) 
    appointment_id = db.Column(db.Integer, db.ForeignKey('appointments.id'), nullable=True) 

    added_for_service = db.Column(db.Integer, nullable=False) # boolean -- is this an added cost for service or other? 

    # Add cost for service 
    service_id = db.Column(db.Integer, db.ForeignKey('services.id'), nullable=True) 
    service = db.relationship('Services', backref='added_time', lazy='joined')
    
    # Time type name will be exactly how it is stored in the prefilled table. 
    time_type = db.Column(db.String(20), nullable = False)#db.Column(db.Integer, db.ForeignKey('time_types.id'), nullable=False) # User can type in x hours, x minutes, gets all converted to minutes 

    additional_time = db.Column(db.Numeric(precision=10, scale=2), nullable=True)
    
    reason = db.Column(db.Text)
    
    __table_args__ = (
        db.Index('idx_client_id_time', 'client_id'),
        db.Index('idx_pet_id_time', 'pet_id'),
        db.Index('idx_appointment_id_time', 'appointment_id'),  # separate index for filtering by favorite only
    )

    
    def __init__():
        pass
    
    
    @classmethod 
    def add_time_for_client(cls, client_id, added_for_service, service_id, service, time_type, additional_time, reason):
        pass 