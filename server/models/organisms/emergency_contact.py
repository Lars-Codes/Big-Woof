from models.db import db
# from models.organisms.client import Client 
# from models.prefilled_tables.user_type import UserType 
from models.contact_info import ContactInfo
from sqlalchemy import Column, String, LargeBinary, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from flask import jsonify, current_app
from sqlalchemy.exc import SQLAlchemyError

class EmergencyContact(db.Model): 
    
    id = db.Column(db.Integer, primary_key = True) 
    fname = db.Column(db.String(50), nullable = False)
    lname = db.Column(db.String(50), nullable = False)
    relationship = db.Column(db.String(50), nullable=False)
    client_id = db.Column(db.Integer, db.ForeignKey('clients.id'), nullable=True)
    
    contact_info_id = db.Column(db.Integer, db.ForeignKey('contact_info.id'), nullable=False)

    contact_info = db.relationship('ContactInfo', lazy='select')
    
    __table_args__ = (
        db.Index('idx_user', 'client_id'),
    ) 
    
    def __init__(self, fname, lname, contact_info, user_type, relationship=None, client_id=None):
        self.fname = fname 
        self.lname = lname 
        self.contact_info = contact_info
        self.user_type = user_type
        self.client_id = client_id
        self.relationship = relationship
    

    @classmethod 
    def create_emergency_contact(cls, relationship, fname, lname, primary_phone, email=None, secondary_phone=None, street_address=None, city=None, state=None, zip=None, client_id=None):
        try: 
            contact = ContactInfo(primary_phone=primary_phone, secondary_phone=secondary_phone, email=email, street_address=street_address, city=city, state=state, zip=zip)
            
            print("CLIENT ID: ", client_id)
            emergency_contact = cls(
                fname, 
                lname, 
                contact, 
                relationship, 
                client_id
            )
            
            db.session.add(emergency_contact)
            db.session.commit()
            return jsonify({
                "success": 1, 
                "message": "Client created succesfully",
                "emergency_contact_id": emergency_contact.id
            })
            
        
        except SQLAlchemyError as e: 
            db.session.rollback()
            print(f"Database error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to create client emergency contact. Database error"}), 500,
            )    
    
        except Exception as e: 
            db.session.rollback()
            print(f"Unknown error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to create client emergency contact. Unknown error"}), 500, 
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