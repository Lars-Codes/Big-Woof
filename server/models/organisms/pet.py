from models.db import db
from sqlalchemy.exc import SQLAlchemyError
from flask import jsonify
from models.organisms.client import Client 

class Pet(db.Model): 
    __tablename__ = "pets"
    
    id = db.Column(db.Integer, primary_key = True)  
    client_id = db.Column(db.Integer, db.ForeignKey('clients.id'), nullable=False) 
    name = db.Column(db.String(50), nullable = False) 
    age = db.Column(db.Integer, nullable = True) 
    deceased = db.Column(db.Integer, nullable = True) 
    weight = db.Column(db.Integer, nullable=True)
    
    breed_id = db.Column(db.Integer, db.ForeignKey('breed.id'), nullable=True)  
    size_tier_id = db.Column(db.Integer, db.ForeignKey('size_tier.id'), nullable=True)   
    coat_type_id = db.Column(db.Integer, db.ForeignKey('coat_types.id'), nullable=True)
    breed = db.relationship('Breed', backref='pets', lazy='select')
    size_tier = db.relationship('SizeTier', backref='pets', lazy='select')
    coat_type = db.relationship('CoatTypes', backref='pets', lazy='select')
    client = db.relationship('Client', back_populates='pets', lazy='select')
    
    notes = db.Column(db.Text, nullable = True) 
    additional_costs = db.relationship('AdditionalCosts', backref='pets', lazy='select', foreign_keys='AdditionalCosts.pet_id')
    additional_time = db.relationship('AddedTime', backref='pets', lazy='select', foreign_keys='AddedTime.pet_id')

    __table_args__ = (
        db.Index('idx_pet_id', 'id'),
        db.Index('idx_pet_id_client_fk', 'client_id'),

    )
    def __init__(self, client_id, name, age=None, breed_id=None, size_tier_id=None, notes=None, weight=None, coat_type_id=None):
        self.client_id = client_id
        self.name = name 
        self.age = age 
        self.breed_id = breed_id 
        self.size_tier_id = size_tier_id
        self.notes = notes 
        self.weight = weight
        self.coat_type_id = coat_type_id
    
    @classmethod 
    def create_pet(cls, client_id, name, age=None, breed_id=None, size_tier_id=None, notes=None, weight=None, coat_type_id=None):
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
            coat_type_id
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
                for field in ['name', 'age', 'weight', 'notes', 'breed_id', 'size_tier_id', 'coat_type_id']:
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
    def get_client_pet_metadata(cls, client_id):
        pass 
    
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
    def get_all_pets(cls, page, page_size): 
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
    def delete_profile_picture(cls, pet_id):
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