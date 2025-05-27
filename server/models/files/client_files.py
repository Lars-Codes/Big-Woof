from models.db import db 
from sqlalchemy.exc import SQLAlchemyError
from flask import jsonify
from models.organisms.client import Client
from models.organisms.pet import Pet 
import os 
from dotenv import load_dotenv
from werkzeug.utils import secure_filename
class ClientFiles(db.Model):
    
    __tablename__="client_files"
    id = db.Column(db.Integer, primary_key = True)  
    client_id = db.Column(db.Integer, db.ForeignKey('clients.id'), nullable=False)
    pet_id = db.Column(db.Integer, db.ForeignKey('pets.id'), nullable=True)
    appointment_id = db.Column(db.Integer, db.ForeignKey('appointments.id'), nullable=True)
    
    document_name = db.Column(db.String(50), nullable = False)
    document_url = db.Column(db.String(250), nullable=False)
    # document = db.Column(db.LargeBinary, nullable=False)  # This is the blob column
 
    document_type = db.Column(db.String(50), nullable = False) # The user selects a document type from a dropdown, prefilled table. This value is stored here 
    # exactly as listed in the table. 
    description = db.Column(db.Text, nullable = True )
    initial_filename = db.Column(db.String(250))
    
    __table_args__ = (
        db.Index('idx_client_id_files', 'client_id'),
        db.Index('idx_appointment_id_files', 'appointment_id'),
    )
    
    def __init__(self, client_id, document_name, document_url, document_type, description, initial_filename, pet_id=None):
        self.client_id = client_id
        self.document_name = document_name
        self.document_url = document_url
        self.document_type = document_type
        self.description = description
        self.pet_id = pet_id
        self.initial_filename = initial_filename 
        
    
    @classmethod 
    def upload_document(cls, client_id, document_name, document, document_type, description, initial_filename, pet_id):
        try: 
            client = Client.query.filter_by(id=client_id).first()
            if not client: 
                return jsonify({
                    "success": 0, 
                    "error": "No client found for client id: " + client_id, 
                }) 
            
            if pet_id != None: 
                pet = Pet.query.filter_by(id=pet_id).first()
                if not pet: 
                    return jsonify({
                        "success": 0, 
                        "error": "No pet found for pet id: " + pet_id, 
                    }) 
            
            load_dotenv()
            image_store = os.environ.get('FILESTORE_URL')  # e.g., '/static/uploads/' or cloud URL

            secure_name = secure_filename(initial_filename)
            
            if pet_id==None: 
                local_path = os.path.join(image_store, client_id, secure_name)
            else: 
                local_path = os.path.join(image_store, client_id, pet_id, secure_name) # sub folders for pets 

            os.makedirs(os.path.dirname(local_path), exist_ok=True)

            document_url = local_path
            
            file = cls(client_id, document_name, document_url, document_type, description, initial_filename, pet_id=None)

            db.session.add(file)
            db.session.commit()
            
            document.save(document_url)
            
            return jsonify({
                "success": 1, 
                "message": "Document successfully uploaded",
                "client_id": client_id
            })
            
        except SQLAlchemyError as e: 
            db.session.rollback()
            print(f"Database error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to upload document. Database error"}), 500,
            ) 
        except Exception as e: 
            db.session.rollback()
            print(f"Unknown error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to upload document. Unknown error"}), 500, 
            )  