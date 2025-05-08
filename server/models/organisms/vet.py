from models.db import db 
from sqlalchemy.exc import SQLAlchemyError
from flask import jsonify
from models.organisms.client import Client 
from models.contact_info import ContactInfo

class Vet(db.Model): 
    
    id = db.Column(db.Integer, primary_key = True) 
    fname = db.Column(db.String(50), nullable = False)
    lname = db.Column(db.String(50), nullable = False)
    client_id = db.Column(db.Integer, db.ForeignKey('clients.id'), nullable=False)
    contact_info_id = db.Column(db.Integer, db.ForeignKey('contact_info.id'), nullable=False)
    notes = db.Column(db.Text, nullable = True) 

    contact_info = db.relationship('ContactInfo', lazy='select', cascade="all, delete", single_parent=True, uselist=False, foreign_keys=[contact_info_id])
    
    __table_args__ = (
        db.Index('idx_vet_client', 'client_id'),
        db.Index('idx_vet_user', 'id'),
    ) 

    def __init__(self, fname, lname, client_id, contact_info=None, notes=None):
        self.fname = fname 
        self.lname = lname 
        self.client_id = client_id 
        self.contact_info = contact_info 
        self.notes = notes  
    
    @classmethod 
    def create_vet(cls, client_id, fname, lname, notes, primary_phone = None, secondary_phone = None, email=None, street_address = None, city = None, state = None, zip=None):
        vet = cls.query.filter_by(client_id=client_id).first()
        client = Client.query.filter_by(id=client_id).first()
        if not client: 
            return (
            jsonify({"success": 0, "error": "Client does not exist for client_id"}), 500,
        )    
        # if vet: 
        #     return jsonify({
        #         "success": 0, 
        #         "message": "Vet already assigned to client",
        #         "vet_id": vet.id
        #     })
                
        contact_info = ContactInfo(primary_phone=primary_phone, secondary_phone=secondary_phone, email=email, street_address=street_address, city=city, state=state, zip=zip)
        vet = cls(fname, lname, client_id, contact_info, notes)
        try: 
            db.session.add(vet)
            db.session.commit()
            return jsonify({
                "success": 1, 
                "message": "Vet created succesfully",
                "vet_id": vet.id
            })
            
        except SQLAlchemyError as e:
            db.session.rollback()
            print(f"Database error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to create vet. Database error"}), 500,
            )
        except Exception as e: 
            db.session.rollback()
            print(f"Unknown error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to create vet. Unknown error"}), 500,
            )  
    
    @classmethod 
    def update_vet_contact(cls, **kwargs):
        client_id = kwargs.get('client_id')
        try: 
            client = Client.query.get(client_id)
            if not client:
                return jsonify({
                    "success": 0, 
                    "error": "No client found for client id: " + client_id, 
                }) 
                
            vet = cls.query.filter_by(client_id=client_id).first()

            fields = [
                'fname', 'lname', 'notes',
            ]
            
            fields_contact = ['city', 'email',
                'primary_phone', 'secondary_phone', 'state',
                'street_address', 'zip']

            if vet:
                # Update existing vet
                for field in fields_contact:
                    if field in kwargs:
                        setattr(vet.contact_info, field, kwargs[field])
                        
                for field in fields: 
                    if field in kwargs: 
                        setattr(vet, field, kwargs[field])
                        
                db.session.commit()
                
                return jsonify({
                    "success": 1, 
                    "message": "Vet information updated succesfully",
                    "vet_id": vet.id
                })
            
            else:
                return jsonify({
                    "success": 0, 
                    "error": "No vet found for client id: " + client_id, 
                }) 

                    
        except SQLAlchemyError as e: 
            db.session.rollback()
            print(f"Database error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to update vet info. Database error"}), 500,
            )  
        except Exception as e: 
            db.session.rollback()
            print(f"Unknown error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to update client vet info. Unknown error"}), 500, 
            )
    
    @classmethod 
    def delete_vet(cls, client_id):
        try: 
            vet = cls.query.filter_by(client_id=client_id).first()

            if not vet:
                db.session.rollback()
                return jsonify({
                    "success": 0, 
                    "error": "Vet not found for specified client id",
                })
                
            db.session.delete(vet)
            db.session.commit()
            return jsonify({
                "success": 1, 
                "message": "Vet deleted succesfully",
            })
    
        except SQLAlchemyError as e: 
            db.session.rollback()
            print(f"Database error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to delete vet. Database error"}), 500,
            )    
    
        except Exception as e: 
            db.session.rollback()
            print(f"Unknown error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to delete vet. Unknown error"}), 500, 
            ) 