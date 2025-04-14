from models.db import db

class SizeTier(db.Model): 
    __tablename__ = "size_tier"
    
    id =  db.Column(db.Integer, primary_key = True) 
    size_tier = db.Column(db.String(50), nullable = False) 
    
    def __init__(self, size_tier): 
        self.size_tier = size_tier
    