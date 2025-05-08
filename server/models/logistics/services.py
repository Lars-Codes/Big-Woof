from models.db import db 

class Services(db.Model):
    
    __tablename__="services"
    id = db.Column(db.Integer, primary_key = True) 
    name = db.Column(db.String(300), nullable=False)

    def __init__(self, name):
        self.name = name 