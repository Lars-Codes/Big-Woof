from models.db import db 
from sqlalchemy.exc import SQLAlchemyError
from flask import jsonify, send_file
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
    description = db.Column(db.Text, nullable = True)
    initial_filename = db.Column(db.String(250))
    
    __table_args__ = (
        db.Index('idx_client_id_files', 'client_id'),
        db.Index('idx_pet_id_files', 'pet_id'),
        db.Index('idx_appointment_id_files', 'appointment_id'),
        db.Index('idx_document_url', 'document_url'),
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
    def upload_document(cls, client_id, document_name, document, document_type, description, pet_id):
        try: 
            # print("filename: ", document.filename)
            
            allowed_extensions = {'pdf', 'jpg', 'jpeg', 'png', 'txt'}
            max_file_size_bytes = 10 * 1024 * 1024  # 10 MB
            extension = document.filename.rsplit('.', 1)[-1].lower()
            
            if extension not in allowed_extensions:
                return jsonify({
                    "success": 0,
                    "error": f"Invalid file type: .{extension}. Allowed types: {', '.join(allowed_extensions)}"
                })
            
            document.seek(0, os.SEEK_END)
            file_size = document.tell()
            document.seek(0)  # Reset file pointer for saving
            if file_size > max_file_size_bytes:
                return jsonify({
                    "success": 0,
                    "error": f"File too large: {file_size / (1024*1024):.2f} MB. Max allowed size is 10 MB"
                })
                
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

            secure_name = secure_filename(document.filename)
            
            if pet_id==None: 
                local_path = os.path.join(image_store, client_id, secure_name)
                document_object = ClientFiles.query.filter_by(document_url=local_path, client_id=client_id).first()
            else: 
                local_path = os.path.join(image_store, client_id, pet_id, secure_name) # sub folders for pets 
                document_object = ClientFiles.query.filter_by(document_url=local_path, client_id=client_id, pet_id=pet_id).first()      
                      
            os.makedirs(os.path.dirname(local_path), exist_ok=True)

            document_url = local_path
            
            # document_object = ClientFiles.query.filter_by(document_url=document_url, client_id=client_id).first()
            if document_object: 
                return jsonify({
                    "success": 0, 
                    "error": "Document with filename " + document_object.initial_filename + " already exists for this client and/or this pet." 
                }) 
            
            # print("object: ", document_object.name)
            
            file = cls(client_id, document_name, document_url, document_type, description, document.filename, pet_id)

            db.session.add(file)
            db.session.commit()
            
            document.save(document_url)
            
            return jsonify({
                "success": 1, 
                "message": "Document successfully uploaded",
                "document_id": file.id
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
    
    @classmethod 
    def delete_document(cls, document_id):
        try: 
            document = ClientFiles.query.get(document_id)

            if document:
                document_url = document.document_url 
                db.session.delete(document)
                db.session.commit()
                if os.path.isfile(document_url):
                    os.remove(document_url)

                    # 2. Get the parent directory
                    parent_dir = os.path.dirname(document_url)

                    # 3. If the directory is now empty, delete it
                    if os.path.isdir(parent_dir) and not os.listdir(parent_dir):
                        os.rmdir(parent_dir)
            else: 
                return (
                jsonify({"success": 0, "error": "Failed to delete document. No document for this document ID found"}), 500,
            )   
            return jsonify({
                "success": 1, 
                "message": "Document successfully deleted",
                "document_id": document_id
            })
            
        except SQLAlchemyError as e: 
            db.session.rollback()
            print(f"Database error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to delete document. Database error"}), 500,
            ) 
        except Exception as e: 
            db.session.rollback()
            print(f"Unknown error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to delete document. Unknown error"}), 500, 
            )  


    @classmethod 
    def preview_document(cls, document_id):
        try: 
            document = ClientFiles.query.get(document_id)

            if document:
                document_url = document.document_url 
                return send_file(filepath, download_name=filename) 
            else: 
                return (
                jsonify({"success": 0, "error": "Failed to delete document. No document for this document ID found"}), 500,
            )   
            # return jsonify({
            #     "success": 1, 
            #     "message": "Document preview successfully retr",
            #     "document_id": document_id
            # })
            
        except SQLAlchemyError as e: 
            db.session.rollback()
            print(f"Database error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to retrieve document preveiw. Database error"}), 500,
            ) 
        except Exception as e: 
            db.session.rollback()
            print(f"Unknown error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to retrieve document preveiw. Unknown error"}), 500, 
            )  