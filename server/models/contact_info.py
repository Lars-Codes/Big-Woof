from models.db import db

class ContactInfo(db.Model):
    
    __tablename__ = 'contact_info'
    id = db.Column(db.Integer, primary_key = True) 
    primary_phone = db.Column(db.String(10))
    secondary_phone = db.Column(db.String(10))
    email = db.Column(db.String(320))
    street_address = db.Column(db.String(255))
    city = db.Column(db.String(50))
    state = db.Column(db.String(30))
    zip = db.Column(db.String(10))
    
    
    def __init__(self, primary_phone = None, secondary_phone = None, email=None, street_address = None, city = None, state = None, zip=None):
        self.primary_phone = primary_phone
        self.secondary_phone = secondary_phone
        self.email = email 
        self.street_address = street_address
        self.city = city 
        self.state = state
        self.zip = zip 