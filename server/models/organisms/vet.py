from models.db import db 

class Vet(db.Model): 
    
    id = db.Column(db.Integer, primary_key = True) 
    fname = db.Column(db.String(50), nullable = False)
    lname = db.Column(db.String(50), nullable = False)
    client_id = db.Column(db.Integer, db.ForeignKey('clients.id'), nullable=True)
    contact_info_id = db.Column(db.Integer, db.ForeignKey('contact_info.id'), nullable=False)
    notes = db.Column(db.Text, nullable = True) 

    contact_info = db.relationship('ContactInfo', lazy='select')
    
    __table_args__ = (
        db.Index('idx_vet_client', 'client_id'),
        db.Index('idx_vet_user', 'id'),
    ) 

    def __init__():
        pass 