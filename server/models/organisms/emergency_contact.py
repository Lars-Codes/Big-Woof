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
    # employee_id = db.Column(db.Integer, db.ForeignKey('employee.id'), nullable=True)

    contact_info_id = db.Column(db.Integer, db.ForeignKey('contact_info.id'), nullable=False)

    contact_info = db.relationship('ContactInfo', lazy='select')
    
    __table_args__ = (
        db.Index('idx_user', 'client_id'),
        db.Index('idx_user', 'id'),
    ) 
    
    def __init__(self, fname, lname, contact_info, relationship=None, client_id=None, employee_id=None):
        self.fname = fname 
        self.lname = lname 
        self.contact_info = contact_info
        self.client_id = client_id
        self.relationship = relationship
        # self.employee_id = employee_id
    

    @classmethod 
    def create_emergency_contact(cls, user_type, relationship, fname, lname, primary_phone, email, secondary_phone, street_address, city, state, zip, id):
        try: 
            contact = ContactInfo(primary_phone=primary_phone, secondary_phone=secondary_phone, email=email, street_address=street_address, city=city, state=state, zip=zip)
            
            if id==0:
                db.session.rollback()
                return jsonify({
                    "success": 0,
                    "error": "Client ID or employee ID must be provided user the id key",
                })
            
            
            emergency_contact = None 
            if user_type == 'client': 
                emergency_contact = cls(
                    fname=fname, 
                    lname=lname, 
                    contact_info=contact, 
                    relationship=relationship, 
                    client_id=id
                )
            elif user_type=="employee":
                emergency_contact = cls(
                    fname=fname, 
                    lname=lname, 
                    contact_info=contact, 
                    relationship=relationship, 
                    employee_id=id
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
    def edit_emergency_contact(cls, **kwargs):
        try: 
            emergency_contact_id = kwargs.get('emergency_contact_id')
            user_type = kwargs.get('user_type')
            user_id = kwargs.get('id')

            if user_type == 'client':
                emergency_contact = cls.query.filter_by(id=emergency_contact_id, client_id=user_id).first()
            elif user_type == 'employee':
                emergency_contact = cls.query.filter_by(id=emergency_contact_id, employee_id=user_id).first()

            
            if not emergency_contact_id:
                return {'success': 0, 'error': 'Emergency contact not found'}

            # Fields directly in EmergencyContact
            for field in ['relationship', 'fname', 'lname']:
                if field in kwargs:
                    setattr(emergency_contact, field, kwargs[field])

            # Related ContactInfo update
            contact_info = emergency_contact.contact_info
            if contact_info:
                for field in ['primary_phone', 'email', 'secondary_phone', 'street_address', 'city', 'state', 'zip']:
                    if field in kwargs:
                        setattr(contact_info, field, kwargs[field])
                        
            db.session.commit()
            return jsonify({
                "success": 1, 
                "message": "Emergency contact updated succesfully",
                "emergency_contact_id": emergency_contact_id
            })
            
        except SQLAlchemyError as e: 
            db.session.rollback()
            print(f"Database error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to update emergency contact. Database error"}), 500,
            )    
    
        except Exception as e: 
            db.session.rollback()
            print(f"Unknown error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to update emergency contact. Unknown error"}), 500, 
            )  
        
    
    @classmethod 
    def delete_emergency_contact(cls, user_type, id, emergency_contact_id):
        try: 
            if user_type=='client':
                emergency_contact = cls.query.filter_by(id=emergency_contact_id, client_id=id).first()
            elif user_type == 'employee':
                emergency_contact = cls.query.filter_by(id=emergency_contact_id, employee_id=id).first()


            if not emergency_contact:
                db.session.rollback()
                return jsonify({
                    "success": 0, 
                    "error": "Emergency contact not found for specified user ID and emergency contact ID",
                })
                
            db.session.delete(emergency_contact)
            db.session.commit()
            return jsonify({
                "success": 1, 
                "message": "Emergency contact deleted succesfully",
                "emergency_contact_id": emergency_contact_id
            })
    
        except SQLAlchemyError as e: 
            db.session.rollback()
            print(f"Database error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to delete emergency contact. Database error"}), 500,
            )    
    
        except Exception as e: 
            db.session.rollback()
            print(f"Unknown error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to delete emergency contact. Unknown error"}), 500, 
            ) 