from models.db import db 
from sqlalchemy.exc import SQLAlchemyError
from flask import jsonify
from datetime import datetime 
from models.organisms.pet import Pet 
from dotenv import load_dotenv
import os 
from werkzeug.utils import secure_filename 
from PIL import Image
import io
from werkzeug.datastructures import FileStorage

class PetImages(db.Model):
    
    __tablename__ = "pet_images"
    id = db.Column(db.Integer, primary_key = True)  
    pet_id = db.Column(db.Integer, db.ForeignKey('pets.id'), nullable=True)
    date = db.Column(db.DateTime, nullable=False) 
    caption = db.Column(db.Text, nullable=True)
    comparison = db.Column(db.Integer, default=0)
    filename = db.Column(db.String(360), nullable=True)

        
    __table_args__ = (
        db.Index('idx_pet_id_images', 'pet_id'),
    ) 
    
    def __init__(self, pet_id, filename, date, comparison=0, caption=None):
        self.pet_id = pet_id
        self.filename=filename
        self.caption = caption 
        self.comparison = comparison 
        self.date = date 
        
    @classmethod 
    def upload_pet_image(cls, client_id, pet_id, image, caption, comparison=0):
        try:             
            pet = Pet.query.get(pet_id)
            if not pet:
                return jsonify({
                    "success": 0, 
                    "error": "Pet not found"
                }) 
            associated_client_id = pet.client_id
            if int(client_id)!=int(associated_client_id): 
                return jsonify({
                    "success": 0, 
                    "error": "Client ID specified (" + str(client_id) + ") does not match the client ID (" + str(associated_client_id) + ") associated with this pet"
                }) 
                
            accepted_formats = ['jpg', 'png', 'jpeg']
            max_file_size_bytes = 5 * 1024 * 1024  # 5 MB
            extension = image.filename.rsplit('.', 1)[-1].lower()
            
            if extension not in accepted_formats:
                return jsonify({
                    "success": 0,
                    "error": f"Invalid file type: .{extension}. Allowed types: {', '.join(accepted_formats)}"
                })
                        
            filename = image.filename
            
            duplicate_image = PetImages.query.filter_by(pet_id=pet_id, filename=filename).first()
            if duplicate_image: 
                return jsonify({
                    "success": 0,
                    "error": "Duplicate filename detected in filestore. Rename image to upload."
                })
                
            format_map = {
                "jpg": "JPEG",
                "jpeg": "JPEG",
                "png": "PNG",
            }

            format_str = format_map.get(extension.lower(), extension.upper())
            
            original_bytes = image.read()
            image.seek(0)
            
            if len(original_bytes) > max_file_size_bytes:
                img = Image.open(io.BytesIO(original_bytes))

                # Compress and save to a new in-memory BytesIO object
                compressed_io = io.BytesIO()
                img.save(compressed_io, format=format_str, quality=50, optimize=True)
                compressed_io.seek(0)

                # Replace original image with new in-memory compressed image
                image = FileStorage(stream=compressed_io, filename=filename)
                
                
            load_dotenv()
            image_store = os.environ.get('IMAGESTORE_URL')  # e.g., '/static/uploads/' or cloud URL

            # Secure the filename and save the image to disk
            secure_name = secure_filename(filename)
            local_path = os.path.join(image_store, str(client_id), str(pet_id), secure_name) # sub folders for pets 
            os.makedirs(os.path.dirname(local_path), exist_ok=True)
            
            image.stream.seek(0) 
            # Save the FileStorage image to the local path
            image.save(local_path)
            # Construct the final image URL
            # Update client record in DB
            image_object = cls(pet_id, filename, datetime.now(), comparison, caption)
            db.session.add(image_object)
            db.session.commit()

            return jsonify({
                "success": 1, 
                "image_id": image_object.id,
            }) 
        except SQLAlchemyError as e: 
            db.session.rollback()
            print(f"Database error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to upload profile picture. Database error"})
            ) 
        except Exception as e: 
            db.session.rollback()
            print(f"Unknown error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to upload profile picture. Unknown error"}) 
            )  

    