from models.db import db 

class AdditionalCosts(db.Model):
    
    __tablename__="additional_costs"
    
    id = db.Column(db.Integer, primary_key = True) 
    client_id = db.Column(db.Integer, db.ForeignKey('clients.id'), nullable=True) 
    pet_id =  db.Column(db.Integer, db.ForeignKey('pets.id'), nullable=True) 
    appointment_id =  db.Column(db.Integer, db.ForeignKey('appointments.id'), nullable=True) 

    added_for_service = db.Column(db.Integer, nullable=False) # boolean -- is this an added cost for mileage or service? 
    added_for_mile = db.Column(db.Integer, nullable=False) # 
    
    # Added cost applies to service or other reason. 
    added_cost = db.Column(db.Numeric(precision=10, scale=2), nullable=True)
    is_percentage = db.Column(db.Integer, nullable=True)
    
    # Add cost for service 
    service_id = db.Column(db.Integer, db.ForeignKey('services.id'), nullable=True) 
    service = db.relationship('Services', backref='additional_costs', lazy='joined')
    
    # Add cost for mile 
    added_cost_per_mile = db.Column(db.Numeric(precision=10, scale=2), nullable=True)
    added_cost_per_mile_is_percent = db.Column(db.Integer, nullable=True)

    reason = db.Column(db.Text)

    
    __table_args__ = (
        db.Index('idx_client_id_added_costs', 'client_id'),
    )
        

    def __init__():
        pass 
    
    # def add_cost_per_client_per