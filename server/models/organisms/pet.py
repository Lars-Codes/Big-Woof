"""
    TODO: 
    - breed class
"""

class Pet: 
    
    id = None 
    client_id = None 
    name = None 
    age = None 
    breed = None 
    size_tier = None 
    notes = None 
    
    def __init__(self, client_id, name, age=None, breed=None, size_tier=None, notes=None):
        self.client_id = client_id
        self.name = name 
        self.age = age 
        self.breed = breed 
        self.size_tier = size_tier
        self.notes = notes 
    
    @classmethod 
    def create_pet(cls, client_id, name, age=None, breed=None, size_tier=None, notes=None):
        pet = cls(
            client_id, 
            name, 
            age, 
            breed, 
            size_tier, 
            notes 
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
    
    @classmethod 
    def deceased(cls, pet_id, deceased=False):
        pass
    
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