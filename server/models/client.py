"""
    TODO: 
    - Send messages CRUD 
    -Time types table 
    - Add document type table 
"""

class Client:
    
    id = None 
    fname = None 
    lname = None
    email = None 
    phone_number = None 
    address = None 
    secondary_email = None 
    secondary_phone = None 
    notes = None 
    disable_emails = False 
    
    # Add more details later 
    def __init__(self, fname, lname, email=None, phone_number=None, address=None, secondary_email=None, secondary_phone=None, notes=None):
        self.fname = fname
        self.lname = lname  
        self.email = email 
        self.phone_number = phone_number
        self.address = address
        self.secondary_email = secondary_email
        self.secondary_phone = secondary_phone
        self.notes = notes 
        self.disable_emails = False 
    
    @classmethod 
    def create_client(cls, fname, lname, email=None, phone_number=None, address=None, secondary_email=None, secondary_phone=None, notes = None):
        client = cls(
            fname, 
            lname, 
            email, 
            phone_number, 
            address, 
            secondary_email, 
            secondary_phone, 
            notes
        )
        
    # ON PAGE LOAD 
    @classmethod 
    def get_client_metadata(cls, client_id): 
        # Return contact info and notes, emergency contact data, pet metadata 
        pass 
    
    @classmethod 
    def get_cost_and_time_stats_metadata(cls, client_id):
        # returns list of payment types/ids, added costs, added time
        pass 
    
    @classmethod 
    def get_appointment_metadata(cls, client_id):
        # returns upcoming appointments, past appointments, appointment stats 
        pass
    
    @classmethod 
    def get_client_document_metadata(cls, client_id):
        # return all client document names and document types 
        pass 
    
    @classmethod 
    def update_fname(cls, client_id, newfname): 
        pass 
        
    @classmethod 
    def update_lname(cls, client_id, newlname): 
        pass 
    
    @classmethod 
    def update_email(cls, client_id, new_email): 
        # TODO: VALIDATE EMAIL 
        pass 
    
    @classmethod 
    def update_phone(cls, client_id, new_phone):
        #TODO: FRONTEND MAKE SURE VALID PHONE 
        pass 
    
    @classmethod 
    def change_address(cls, client_id, new_address): 
        # TODO: VALIDATE ADDRESS 
        pass 
    
    @classmethod 
    def change_secondary_email(cls, client_id, new_email):
        pass 
    
    @classmethod 
    def change_secondary_phone(cls, client_id, new_phone):
        pass 
    
    @classmethod 
    def update_notes(cls, client_id, new_notes):
        pass 
    
    @classmethod 
    def get_all_clients(cls, page, page_size): 
        # TODO: Pagination? Which data does this pass? 
        # TODO: Also pass emergency contact information, some pet information, vet info, 
        # client payment types, client documents, client message opt out, additional costs, preferred payment method, 
        # additional time, upcoming appointments. Don't send all of the data up at once, just previews of some stuff. 
        # Can click on pet and stuff for more details, but basically just send text for this. 
        # Also pass preferred contact method 
        pass 
    
    
    @classmethod 
    def delete_client(cls, client_id_array):
        pass 
    
    @classmethod 
    def add_payment_type(cls, client_id, payment_type_id, online_payment_id=None):
        """_summary_
            If payment_type_id == Venmo, PayPal, or Zelle, store online payment id in
            client_online_payments table
        """
        pass 
    
    @classmethod 
    def get_payment_types_metadata(cls, client_id):
        pass # return payment types. if payment type is paypal, venmo, zelle, then also give username 
    
    @classmethod 
    def contact_methods(cls, client_id, preferred_contact_method, contact_type): 
        # phone or email 
        pass 
    
    @classmethod 
    def added_client_cost(cls, client_id, is_percentage, is_per_mile, reason, price_change, service_id=None): 
        """_summary_
        Args:
            client_id (_type_): client 
            is_per_mile (bool): Indicates if adding/subtracting cost per mile
            is_percentage (bool): Indicates if price change is a percentage or exact amount. 
            reason (_type_): Reason for price change 
            price_change: Price change as percentage or exact dollar amount. Will be negative if discount. 
            service_id (_type_, optional): Defaults to None. If no service specified, apply price change to all services for this client. 
        """
        pass 
    
    @classmethod 
    def added_client_time(cls, client_id, time_type_id, additional_time, notes, service_id=None):
        """_summary_
        Args:
            client_id (_type_): Client 
            time_type_id (_type_): References the ID of a "time type" in the pre-filled time-type table (hours, minutes, etc)
            additional_time (_type_): Added time 
            notes (_type_): notes 
            service_id (_type_, optional): Defaults to None. If no service specified, apply time change to all services for this client. 
        """
        pass
    
    @classmethod 
    def get_appointment_metadata(cls, client_id):
        # return time/date and potential other details
        pass
    
    @classmethod 
    def get_added_cost_metadata(cls, client_id):
        pass 
    
    @classmethod 
    def get_added_time_metadata(cls, client_id):
        pass
    
    @classmethod 
    def get_appointment_stats(cls, client_id): # late, no shows, cancellations, late cancellations 
        pass 
    
    
    @classmethod 
    def add_client_documents(cls, client_id, document, document_name, document_type_id): 
        # add client document. Select document type from a dropdown. 
        pass 
    
    @classmethod 
    def get_document(cls, client_id, document_id): 
        pass 
    
    @classmethod 
    def client_searchbar(cls, letters_to_search): # If user types "lar" return all clients that start with lar
        pass
    