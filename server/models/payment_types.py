class Payment_Types: 
    
    payment_type = None 
    
    def __init__(self, payment_type):
        self.payment_type = payment_type
        
    @classmethod 
    def create_payment_type(cls, payment_type): 
        pass 
    
    @classmethod 
    def get_all_payment_types(cls): 
        # Get all configured payment types
        pass 

    @classmethod 
    def get_payment_types_for_client(cls, client_id):
        pass 

    @classmethod 
    def update_payment_type(cls, payment_type_id, updated_name): 
        pass 
    
    @classmethod 
    def delete_payment_type(cls, payment_type_id): 
        pass 