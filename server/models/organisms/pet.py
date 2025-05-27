from models.db import db
from sqlalchemy.exc import SQLAlchemyError
from flask import jsonify, send_from_directory
from models.organisms.client import Client 
from dotenv import load_dotenv
from PIL import Image
from werkzeug.utils import secure_filename
import os 
class Pet(db.Model): 
    __tablename__ = "pets"
    
    id = db.Column(db.Integer, primary_key = True)  
    client_id = db.Column(db.Integer, db.ForeignKey('clients.id'), nullable=False) 
    name = db.Column(db.String(50), nullable = False) 
    age = db.Column(db.Integer, nullable = True) 
    deceased = db.Column(db.Integer, nullable = True) 
    weight = db.Column(db.Integer, nullable=True)
    gender = db.Column(db.Integer, nullable=True)
    fixed = db.Column(db.Integer, nullable=True)
    breed_id = db.Column(db.Integer, db.ForeignKey('breed.id'), nullable=True)  
    size_tier_id = db.Column(db.Integer, db.ForeignKey('size_tier.id'), nullable=True)   
    coat_type_id = db.Column(db.Integer, db.ForeignKey('coat_types.id'), nullable=True)
    typical_groomer_id = db.Column(db.Integer, db.ForeignKey('employee.id'), nullable=True)
    breed = db.relationship('Breed', backref='pets', lazy='select')
    size_tier = db.relationship('SizeTier', backref='pets', lazy='select')
    coat_type = db.relationship('CoatTypes', backref='pets', lazy='select')
    client = db.relationship('Client', back_populates='pets', lazy='select')
    typical_groomer = db.relationship('Employee', backref='pets', lazy='select')

    pet_problems = db.relationship('PetProblems', back_populates='pet', lazy='select', cascade='all, delete-orphan', foreign_keys='PetProblems.pet_id')

    
    notes = db.Column(db.Text, nullable = True) 
    additional_costs = db.relationship('AdditionalCosts', backref='pets', lazy='select', foreign_keys='AdditionalCosts.pet_id')
    additional_time = db.relationship('AddedTime', backref='pets', lazy='select', foreign_keys='AddedTime.pet_id')

    profile_pic_url = db.Column(db.String(50), default="")

    __table_args__ = (
        db.Index('idx_pet_id', 'id'),
        db.Index('idx_pet_id_client_fk', 'client_id'),
    )
    
    def __init__(self, client_id, name, age=None, breed_id=None, size_tier_id=None, notes=None, weight=None, coat_type_id=None, gender=None, fixed=None):
        self.client_id = client_id
        self.name = name 
        self.age = age 
        self.breed_id = breed_id 
        self.size_tier_id = size_tier_id
        self.notes = notes 
        self.weight = weight
        self.coat_type_id = coat_type_id
        self.gender = gender 
        self.fixed = fixed
    
    
    @classmethod 
    def create_pet(cls, client_id, name, age=None, breed_id=None, size_tier_id=None, notes=None, weight=None, coat_type_id=None, gender=None, fixed=None):
        client = Client.query.filter_by(id=client_id).first()
        if not client: 
            return (
                jsonify({"success": 0, "error": "Client does not exist for client_id"}), 500,
        )
        
        client.num_pets = client.num_pets + 1    
        
        pet = cls(
            client_id, 
            name, 
            age, 
            breed_id, 
            size_tier_id, 
            notes, 
            weight, 
            coat_type_id, 
            gender,
            fixed
        )
        try: 
            db.session.add(pet)
            db.session.commit()
            return jsonify({
                "success": 1, 
                "message": "Pet created succesfully",
                "pet_id": pet.id
            })       
        except SQLAlchemyError as e:
            db.session.rollback()
            print(f"Database error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to create client. Database error"}), 500,
            )
        except Exception as e: 
            db.session.rollback()
            print(f"Unknown error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to create client. Unknown error"}), 500,
            )  
   
    @classmethod 
    def edit_pet_basic_data(cls, **kwargs):
        pet_id = kwargs.get('pet_id')
        
        try: 
            pet = cls.query.filter_by(id=pet_id).first()

            if pet:                
                for field in ['name', 'age', 'weight', 'notes', 'breed_id', 'size_tier_id', 'coat_type_id', 'gender', 'fixed']:
                    if field in kwargs:
                        setattr(pet, field, kwargs[field])

                db.session.commit()
                return jsonify({
                    "success": 1, 
                    "message": "Pet basic data updated succesfully",
                    "pet_id": pet_id
                })
            
            else: 
                return jsonify({
                    "success": 0, 
                    "error": "No pet found for pet id: " + pet_id, 
                }) 
        
        except SQLAlchemyError as e: 
            db.session.rollback()
            print(f"Database error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to update pet basic data. Database error"}), 500,
            )  
        except Exception as e: 
            db.session.rollback()
            print(f"Unknown error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to update pet basic data. Unknown error"}), 500, 
            )

    @classmethod 
    def delete_pets(cls, pet_id_array):
        try: 
            ids_to_delete = [int(pet_id) for pet_id in pet_id_array]
            num_deleted = 0

            for pet_id in ids_to_delete:
                pet = Pet.query.get(pet_id)
                if pet:
                    db.session.delete(pet)
                    num_deleted += 1
                    pet.client.num_pets = pet.client.num_pets - 1 
                db.session.commit()
            return jsonify({"success": 1, "num_deleted": num_deleted})
        except SQLAlchemyError as e: 
            db.session.rollback()
            print(f"Database error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to delete pet(s). Database error"}), 500,
            ) 
        except Exception as e: 
            db.session.rollback()
            print(f"Unknown error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to delete pet(s). Unknown error"}), 500, 
            )     


    @classmethod 
    def get_all_pets(cls, page, page_size, searchbar_chars): 
        try: 
            query = db.session.query(Pet)

            # Apply search criteria if provided
            if searchbar_chars:
                search_pattern = f"%{searchbar_chars}%"
                query = query.filter(
                (Pet.name.ilike(search_pattern)) 
            )

            # Order results alphabetically
            query = query.order_by(Pet.name.asc())

            # Paginate query
            pagination = query.paginate(page=page, per_page=page_size, error_out=False)
            pets = pagination.items

            # Send up data 
            pets_data = [
            {
            "pet_id": pet.id, 
            "name": pet.name,
            "client_fname": pet.client.fname,
            "client_lname": pet.client.lname,
            "breed": pet.breed.name if pet.breed else "", 
            }
            for pet in pets 
            ]

            return jsonify({
            "success": 1, 
            "data": pets_data, 
            "total_pages": pagination.pages,
            "current_page": pagination.page
            }) 

        except SQLAlchemyError as e: 
            db.session.rollback()
            print(f"Database error: {e}")
            return (
            jsonify({"success": 0, "error": "Failed to get all pets. Database error"}), 500,
            )    
        except Exception as e: 
            db.session.rollback()
            print(f"Unknown error: {e}")
            return (
            jsonify({"success": 0, "error": "Failed to get all pets. Unknown error"}), 500, 
            )  
                    
    @classmethod 
    def change_deceased_status(cls, pet_id, deceased): 
        try: 
            if int(deceased)!=1 and int(deceased)!=0:
                return jsonify({
                "success": 0, 
                "error": "Deceased bool must be either 0 or 1"
                }) 
            
            pet = cls.query.filter_by(id=pet_id).first()
            if not pet: 
                return jsonify({
                    "success": 0, 
                    "error": "No pet found for pet id: " + pet_id, 
                }) 
                
            client = pet.client
            if int(deceased)==1 and pet.deceased!=1:  
                client.num_pets = client.num_pets - 1 
            elif int(deceased) == 0 and pet.deceased!=0: 
                client.num_pets = client.num_pets + 1 
                
            pet.deceased = deceased
            db.session.commit()            
            
            if int(deceased)==1: 
                return jsonify({
                "success": 1, 
                "pet_id": pet_id, 
                "message": "Deceased status updated sucessfully"
                }) 
            else: 
                return jsonify({
                    "success": 1, 
                    "pet_id": pet_id,
                    "message": "Pet resurrected?"
                }) 

        except SQLAlchemyError as e: 
            db.session.rollback()
            print(f"Database error: {e}")
            return (
            jsonify({"success": 0, "error": "Failed to mark deceased status. Database error"}), 500,
            )    
        except Exception as e: 
            db.session.rollback()
            print(f"Unknown error: {e}")
            return (
            jsonify({"success": 0, "error": "Failed to mark deceased status. Unknown error"}), 500, 
            )     

  
    @classmethod  
    def upload_profile_picture(cls, pet_id, image, filename, ext):
        try: 
            pet = Pet.query.get(pet_id)
            if not pet:
                return jsonify({
                    "success": 0, 
                    "error": "Pet not found"
                }) 
                
            load_dotenv()
            image_store = os.environ.get('IMAGESTORE_URL')  # e.g., '/static/uploads/' or cloud URL
            # Secure the filename and save the image to disk
            secure_name = secure_filename(filename)
            local_path = os.path.join(image_store, pet_id, secure_name)
            os.makedirs(os.path.dirname(local_path), exist_ok=True)

            # Save the FileStorage image to the local path
            image.save(local_path)

            # Resize the image
            img = Image.open(local_path)
            img.thumbnail((512, 512))  # Resize to 512x512

            # Save the resized image (overwrite or create new file)
            img.save(local_path, quality=85)

            # Construct the final image URL
            image_url = secure_name
            # Update client record in DB
            print(image_url)
            pet.profile_pic_url = image_url
            db.session.commit()

            return jsonify({
                "success": 1, 
                "pet_id": pet_id,
                "image_url": image_url
            }) 
        except SQLAlchemyError as e: 
            db.session.rollback()
            print(f"Database error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to upload profile picture. Database error"}), 500,
            ) 
        except Exception as e: 
            db.session.rollback()
            print(f"Unknown error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to upload profile picture. Unknown error"}), 500, 
            )  

    @classmethod 
    def get_profile_picture(cls, pet_id):
        try: 
            pet = Pet.query.with_entities(Pet.profile_pic_url).filter_by(id=pet_id).first()
            print("profile pic: ", pet_id)

            if not pet or pet.profile_pic_url == "":
                return jsonify({"success": 1, "exists": 0, "message": "No profile picture associated with this pet."}), 404
            load_dotenv()
            image_store = os.environ.get('IMAGESTORE_URL').strip()
                
            image_dir = os.path.join(image_store, pet_id)
            
            full_path = os.path.join(image_dir, pet.profile_pic_url)
            if not os.path.exists(full_path):
                return jsonify({"success": 0, "error": "Image URL associated with this pet does not map to an image in the image store."}), 404
            
            return send_from_directory(image_dir, pet.profile_pic_url)
            
        except SQLAlchemyError as e: 
            db.session.rollback()
            print(f"Database error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to get profile picture. Database error"}), 500,
            ) 
        except Exception as e: 
            db.session.rollback()
            print(f"Unknown error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to get profile picture. Unknown error"}), 500, 
            )  

    @classmethod 
    def delete_profile_picture(cls, pet_id):
        try: 
            pet = Pet.query.filter_by(id=pet_id).first()
            if not pet:
                return jsonify({
                    "success": 0, 
                    "error": "Pet not found"
                }) 
            
            load_dotenv()
            image_store = os.environ.get('IMAGESTORE_URL').strip()
            image_dir = os.path.join(image_store, pet_id)
            full_path = os.path.join(image_dir, pet.profile_pic_url)
            if not os.path.exists(full_path):
                return jsonify({"success": 0, "error": "Image URL associated with this pet does not map to an image in the image store."}), 404
            
            if os.path.isfile(full_path):
                os.remove(full_path)
            else:
                return jsonify({"success": 0, "error": "Path does not point to a file."}), 404
            
            pet.profile_pic_url = ""
            db.session.commit()
            return jsonify({"success": 1, "error": "Successfully deleted profile picture for this pet"}), 404
        except SQLAlchemyError as e: 
            db.session.rollback()
            print(f"Database error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to get profile picture. Database error"}), 500,
            ) 
        except Exception as e: 
            db.session.rollback()
            print(f"Unknown error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to get profile picture. Unknown error"}), 500, 
            )       
    @classmethod 
    def get_initial_image_data(cls, pet_id):
        pass 
    
    @classmethod 
    def get_cost_and_time_metadata(cls, pet_id):
        pass
    
    @classmethod 
    def get_document_metadata(cls, pet_id):
        pass
    
    @classmethod 
    def edit_name(cls, pet_id, new_name): 
        pass 
    
    @classmethod 
    def edit_age(cls, pet_id, new_age): 
        pass
    
    @classmethod 
    def edit_breed(cls, pet_id, breed_id):
        pass 
    
    @classmethod 
    def edit_size_tier(cls, pet_id, size_tier_id):
        pass
    
    @classmethod
    def edit_notes(cls, pet_id, new_notes):
        pass 
    
    @classmethod 
    def get_pet(cls, pet_id):
        """
            Sending pet info and metadata for rabies/vaccination records 
        """
        pass
    
    @classmethod
    def delete_pet(cls, pet_id_array):
        pass
    
    @classmethod 
    def delete_image(cls, pet_id, image_id):
        pass
    
    @classmethod 
    def add_profile_picture(cls, pet_id, picture_blob):
        pass
    
    @classmethod 
    def change_profile_picture(cls, pet_id, new_picture_blob):
        pass 
    
    @classmethod 
    def get_photo_gallery_lowres(cls, pet_id):
        pass # get low resolution images for previews 
    
    @classmethod 
    def delete_document(cls, pet_id, document_id):
        pass
    
    @classmethod 
    def edit_behavioral_issue(cls, pet_id, problem_id, new_problem, new_solution):
        pass 
    
    @classmethod 
    def delete_behavioral_issue(cls, pet_id, problem_id):
        pass 
    
    @classmethod 
    def get_image(cls, pet_id, image_id):
        pass 
    
    @classmethod 
    def add_image(cls, pet_id, comparison, photo):
        # comparison is bool 
        pass  
    
    @classmethod 
    def add_document(cls, client_id, pet_id, document_name, document_type, document):
        pass 
    
    # @classmethod 
    # def deceased(cls, pet_id, deceased=False):
    #     pass
    
    @classmethod
    def get_pet_document(pet_id, document_id):
        pass
    
    @classmethod 
    def add_pet_document(pet_id, document_name, document_type, document):
        pass
    
    @classmethod 
    def add_behavioral_issue(cls, pet_id, problem, solution=None):
        pass 

    @classmethod 
    def assign_new_owner(cls, pet_id, new_owner_id):
        pass
    
    @classmethod 
    def pet_searchbar(cls, characters):
        pass 
    
    @classmethod 
    def create_frequency_recomendation(cls, pet_id, service_id, recommended_frequency, time_type):
        pass 
    
    @classmethod 
    def update_frequency_recomendation(cls, pet_id, service_id, recommended_frequency, time_type):
        pass 
    
    @classmethod 
    def delete_frequency_recomendation(cls, pet_id, frequency_rec_id):
        pass
    
    @classmethod 
    def add_client_homework(cls, pet_id, homework_title, homework_text, frequency, time_type_id):
        pass 
    
    @classmethod 
    def edit_client_homework(cls, pet_id, homework_id, homework_title, homework_text, frequency, time_type_id):
        pass
    
    @classmethod 
    def delete_client_homework(cls, pet_id, homework_id):
        pass 
    
    def added_pet_time(cls, pet_id, time_type_id, additional_time, notes, service_id=None):
        pass
    
    def edit_pet_time(cls, pet_id, added_time_id, time_type_id, additional_time, notes, service_id=None):
        pass 
    
    def delete_pet_time(pet_id, added_time_id):
        pass
    
    def added_pet_cost(cls, pet_id, is_percentage, is_per_mile, reason, price_change, service_id=None):
        pass
    
    def edit_pet_cost(cls, pet_id, additional_costs_id, is_percentage, is_per_mile, reason, price_change, service_id=None):
        pass 
    
    def delete_pet_cost(cls, pet_id, additional_costs_id):
        pass 