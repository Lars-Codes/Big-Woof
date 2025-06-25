from models.db import db
from sqlalchemy.exc import SQLAlchemyError
from flask import jsonify, send_from_directory
from models.organisms.client import Client 
from models.organisms.employee import Employee
from models.prefilled_tables.breed import Breed
from models.prefilled_tables.size_tier import SizeTier
from models.prefilled_tables.coat_types import CoatTypes
from models.prefilled_tables.hair_length import HairLength
from dotenv import load_dotenv
from PIL import Image
from werkzeug.utils import secure_filename
import os 
from sqlalchemy.orm import joinedload
from sqlalchemy import select
import shutil

class Pet(db.Model): 
    __tablename__ = "pets"
    
    id = db.Column(db.Integer, primary_key = True)  
    name = db.Column(db.String(50), nullable = False) 
    age = db.Column(db.Integer, nullable = True) 
    deceased = db.Column(db.Integer, nullable = True) 
    weight = db.Column(db.Integer, nullable=True)
    gender = db.Column(db.Integer, nullable=True)
    fixed = db.Column(db.Integer, nullable=True)
    
    client_id = db.Column(db.Integer, db.ForeignKey('clients.id'), nullable=False) 
    breed_id = db.Column(db.Integer, db.ForeignKey('breed.id'), nullable=True)  
    size_tier_id = db.Column(db.Integer, db.ForeignKey('size_tier.id'), nullable=True)   
    coat_type_id = db.Column(db.Integer, db.ForeignKey('coat_types.id'), nullable=True)
    hair_length_id = db.Column(db.Integer, db.ForeignKey('hair_length.id'), nullable=True)
    typical_groomer_id = db.Column(db.Integer, db.ForeignKey('employee.id'), nullable=True)
    
    appointments = db.relationship('Appointment', backref='pet', lazy='select', cascade='all, delete-orphan', foreign_keys='Appointment.pet_id')
    breed = db.relationship('Breed', backref='pets', lazy='select')
    size_tier = db.relationship('SizeTier', backref='pets', lazy='select')
    coat_type = db.relationship('CoatTypes', backref='pets', lazy='select')
    client = db.relationship('Client', back_populates='pets', lazy='select')
    typical_groomer = db.relationship('Employee', backref='pets', lazy='select')
    hair_length = db.relationship('HairLength', backref='pets', lazy='select')
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
    
    def __init__(self, client_id, name, age=None, breed_id=None, size_tier_id=None, notes=None, weight=None, coat_type_id=None, gender=None, fixed=None, hair_length_id=None):
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
        self.hair_length_id = hair_length_id
    
    
    @classmethod 
    def create_pet(cls, client_id, name, age=None, breed_id=None, size_tier_id=None, notes=None, weight=None, coat_type_id=None, gender=None, fixed=None, hair_length_id=None):
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
            fixed, 
            hair_length_id
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
                for field in ['name', 'age', 'weight', 'notes', 'breed_id', 'size_tier_id', 'coat_type_id', 'gender', 'fixed', 'hair_length_id', 'typical_groomer_id', 'client_id']:
                    if field in kwargs:
                        
                        if field=='typical_groomer_id':
                            employee = Employee.query.filter_by(id=kwargs.get('typical_groomer_id')).first()
                            if not employee: 
                                return jsonify({
                                "success": 0, 
                                "error": "No employee found for employee id", 
                                }) 
                        elif field=='client_id':
                            client = Client.query.filter_by(id=kwargs.get('client_id')).first()
                            if not client: 
                                return jsonify({
                                "success": 0, 
                                "error": "No client found for client id", 
                                }) 
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
                    
                    profile_pic_path = pet.profile_pic_url
                    load_dotenv()
                    image_store = os.environ.get('IMAGESTORE_URL')  # e.g., '/static/uploads/' or cloud URL
                    secure_name = secure_filename(profile_pic_path)
                    local_path = os.path.join(image_store, str(pet.client_id), str(pet_id), secure_name)
                    
                    file_store = os.environ.get('FILESTORE_URL')
                    path_to_pet_files = os.path.join(file_store, str(pet.client_id), str(pet_id))

                    if os.path.isdir(path_to_pet_files):
                        shutil.rmtree(path_to_pet_files)

                    if os.path.isfile(local_path):
                        os.remove(local_path)
                        # 2. Get the parent directory
                        parent_dir = os.path.dirname(local_path)

                        # 3. If the directory is now empty, delete it
                        if os.path.isdir(parent_dir) and not os.listdir(parent_dir):
                            os.rmdir(parent_dir)
                    
                    
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
    def get_pet_metdata(cls, pet_id):
        try: 
            pet = cls.query.with_entities(cls.id, cls.name, cls.age, cls.deceased, cls.weight, cls.gender, cls.fixed, cls.notes).first()

            if pet: 
                stmt = select(
                    Client.fname.label("client_fname"),
                    Client.lname.label("client_lname"), 
                    Client.id.label("client_id"), 
                    Breed.name.label("breed_name"),
                    SizeTier.size_tier.label("size_tier"), 
                    CoatTypes.coat_type.label("coat_type"), 
                    HairLength.length.label("hair_length"), 
                    Employee.fname.label("employee_fname"), 
                    Employee.lname.label("employee_lname"), 
                    Employee.id.label("employee_id")
                ).outerjoin(Pet.breed).outerjoin(Pet.size_tier).outerjoin(Pet.coat_type).join(Pet.client).outerjoin(Pet.hair_length).outerjoin(Pet.typical_groomer).where(Pet.id == pet_id)

                result = db.session.execute(stmt).first()
                
                owner_name = result.client_fname + " " + result.client_lname
                employee_name = None 
                if result.employee_fname and result.employee_lname: 
                    employee_name = result.employee_fname + " " + result.employee_lname
                
                pet_data = {
                    "pet_data": {
                        "id": pet.id, 
                        "name": pet.name, 
                        "age": pet.age if pet.age else "", 
                        "deceased": pet.deceased if pet.deceased else "", 
                        "weight": pet.weight if pet.weight else "", 
                        "gender": pet.gender if pet.gender else "", 
                        "fixed": pet.fixed if pet.fixed else "", 
                        "notes": pet.notes if pet.notes else "", 
                        "owner_name": owner_name,
                        "breed": result.breed_name, 
                        "size_tier": result.size_tier if result.size_tier else "", 
                        "coat_type": result.coat_type if result.coat_type else "", 
                        "hair_length": result.hair_length if result.hair_length else "", 
                        "typical_groomer": employee_name if employee_name else "", 
                        "typical_groomer_id": result.employee_id if result.employee_id else "", 
                        "owner_id": result.client_id
                    }
                }

                return jsonify({
                    "success": 1, 
                    "data": pet_data, 
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
                jsonify({"success": 0, "error": "Failed to fetch pet data. Database error"}), 500,
            )
        except Exception as e: 
            db.session.rollback()
            print(f"Unknown error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to fetch pet data. Unknown error"}), 500,
            )  
        
    
   