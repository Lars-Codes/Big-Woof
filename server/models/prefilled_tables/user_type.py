from models.db import db

class UserType(db.Model):
    __tablename__ = 'user_type'
    id = db.Column(db.Integer, primary_key = True) 
    user_type = db.Column(db.String(50))
    
    @classmethod 
    def get_user_types(cls):
        pass 