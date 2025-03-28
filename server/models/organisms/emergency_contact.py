from models.db import db
from sqlalchemy import Column, String, LargeBinary, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from flask import jsonify, current_app

class Emergency_Contact(db.Model): 
    
    id = db.Column(db.Integer, primary_key = True) 
    client_id = db.Column(db.Integer, db.ForeignKey('clients.id'), nullable=False)
     
    user_type_id = None 
    relationship = None 
    fname = None 
    lname = None 
    primary_phone = None 
    primary_email = None 
    secondary_phone = None 
    address = None 
    client_id = None 
    employee_id = None 
    
    def __init__(self, user_type_id, relationship, fname, lname, primary_phone=None, primary_email=None, secondary_phone=None, address=None, client_id=None, employee_id=None):
        self.user_type_id = user_type_id
        self.relationship = relationship
        self.fname = fname
        self.lname = lname 
        self.primary_phone = primary_phone
        self.primary_email = primary_email
        self.secondary_phone = secondary_phone
        self.address = address
        
        if (client_id == None and employee_id == None) or (primary_email == None and primary_phone == None): 
            # throw error 
            pass 
        else: 
            self.client_id = client_id
            self.employee_id = employee_id
    
    @classmethod 
    def add_emergency_contact(cls, user_type_id, relationship, fname, lname, primary_phone, primary_email, secondary_phone=None, address=None, client_id=None, employee_id=None):
        emergency_contact = cls(
            user_type_id, 
            relationship, 
            fname, 
            lname, 
            primary_phone, 
            primary_email, 
            secondary_phone, 
            address, 
            client_id, 
            employee_id
        ) 
        
    @classmethod 
    def get_emergency_contacts(cls, user_type_id, id): 
        """
            If user type id == client: 
                - search for emergency contact by client id 
            Else: 
                - search for emergency contact by employee id 
        """
        pass 
    
    @classmethod 
    def update_emergency_contact(cls, relationship, fname, lname, primary_phone=None, primary_email=None, secondary_phone=None, address=None):
        pass 
    
    @classmethod 
    def delete_emergency_contact(cls, user_type_id, id, emergency_contact_id):
        """
            If user type id == client: 
                - search for emergency contact by client id 
            Else: 
                - search for emergency contact by employee id 
        """
        pass 