from models.db import db 

class ClientPaymentTypes(db.Model):
    
    __tablename__="client_payment_types"
    
    id = db.Column(db.Integer, primary_key = True) 
    client_id = db.Column(db.Integer, db.ForeignKey('clients.id'), nullable=False) 
    
    payment_type_id = db.Column(db.Integer, db.ForeignKey("payment_types.id"), nullable=False)
    payment_type = db.relationship('PaymentTypes', lazy='select')

    __table_args__ = (
        db.Index('idx_client_id_payment', 'client_id'),
    )
        
    def __init__():
        pass 