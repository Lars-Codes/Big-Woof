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
    # def get_vaccination_documents_metadata(cls, pet_id):
    #     pass
    
    # @classmethod 
    # def get_rabies_documents_metadata(cls, pet_id):
    #     pass
    
    @classmethod 
    def add_behavioral_issue(cls, pet_id, problem, solution=None):
        pass 