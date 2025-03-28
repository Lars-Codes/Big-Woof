from models.db import db
from sqlalchemy import Column, String, LargeBinary, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from flask import jsonify, current_app

class ContactInfo(db.Model):
    
    __tablename__ = 'contact_info'
    id = db.Column(db.Integer, primary_key = True) 
    fname = db.Column(db.String(50), nullable = False)
    lname = db.Column(db.String(50), nullable = False)
    primary_phone = db.Column(db.String(10))
    secondary_phone = db.Column(db.String(10))
    street_address = db.Column(db.String(255))
    city = db.Column(db.String(50)),
    state = db.Column(db.String(30))
    zip = db.Column(db.String(10))
    
    def __init__(self, fname, lname, primary_phone = None, secondary_phone = None, street_address = None, city = None, state = None, zip=None):
        self.fname = fname 
        self.lname = lname 
        self.primary_phone = primary_phone
        self.secondary_phone = secondary_phone
        self.street_address = street_address
        self.city = city 
        self.state = state
        self.zip = zip 