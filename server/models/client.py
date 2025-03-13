class Client:
    
    name = None 
    email = None 
    phone_number = None 
    address = None 
    secondary_email = None 
    secondary_phone = None 
    
    # Add more details later 
    def __init__(self, name, email, phone_number, address, secondary_email, secondary_phone):
        self.name = name 
        self.email = email 
        self.phone_number = phone_number
        self.address = address
        self.secondary_email = secondary_email
        self.secondary_phone = secondary_phone
        
    
        