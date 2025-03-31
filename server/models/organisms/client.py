from models.db import db
from sqlalchemy.exc import SQLAlchemyError
from flask import jsonify

class Client(db.Model):
    __tablename__ = 'clients'
     
    id = db.Column(db.Integer, primary_key = True) 
    contact_info_id = db.Column(db.Integer, db.ForeignKey('contact_info.id'), nullable=False)
    num_pets = db.Column(db.Integer) 
    contact_info = db.relationship('contact_info', backref='Client', lazy='select')
    notes = db.Column(db.Text)
    favorite = db.Column(db.Integer)
    user_type_id = None 
    fname = None 
    lname = None 
    email = None 
    phone_number = None 
    street_address = None 
    city = None 
    state = None 
    zip = None 
    secondary_phone = None 
    
    
    # Add more details later 
    def __init__(self, fname, lname, user_type_id, phone_number, email=None, street_address=None, city=None, state=None, zip=None, secondary_phone=None, notes=None, num_pets=0, favorite=0):
        self.fname = fname
        self.lname = lname  
        self.email = email 
        self.phone_number = phone_number
        self.street_address = street_address
        self.city = city 
        self.state = state 
        self.zip = zip 
        self.secondary_phone = secondary_phone
        self.notes = notes 
        self.num_pets = num_pets 
        self.user_type_id = user_type_id
        self.favorite = favorite 
    
    @classmethod 
    def create_client(cls, fname, lname, phone_number, email=None, street_address=None, city=None, state=None, zip=None, secondary_phone=None, notes = None):
        client = cls(
            fname, 
            lname, 
            phone_number, 
            email,
            street_address,
            city, 
            state, 
            zip, 
            secondary_phone, 
            notes
        )
        
        try: 
            db.session.add(client)
            db.session.commit()
            return jsonify({
                "success": 1, 
                "message": "Client created succesfully",
                "client_id": client.id
            })
            
        except SQLAlchemyError as e:
            db.session.rollback()
            print(f"Database error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to create client. Database error"}),
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
    def get_all_clients(cls, page, page_size, searchbar_chars=""): 
        try: 
            query = cls.query

            # If search criteria, filter fname and lname fields by search criteria 
            if searchbar_chars != "":
                query = query.filter(cls.fname.ilike(searchbar_chars))
                query = query.filter(cls.lname.ilike(searchbar_chars))
                
            query = query.filter(cls.favorite == False)  # Only non-favorite clients
            non_favorites = query
            favorites = cls.query.filter(cls.favorite == True) # Only favorite clients 

            combined_query = non_favorites.union(favorites) # Combine to queries
            combined_query = combined_query.order_by(cls.fname.asc()) # Order alphabetically 
            
            # Paginate query 
            pagination = query.paginate(page=page, per_page=page_size, error_out=False)
            clients = pagination.items 
            
            # Send up data 
            clients_data = [
                {
                    "client_id": clients.id, 
                    "fname": clients.fname, 
                    "lname": clients.lname, 
                    "num_pets": clients.num_pets if clients.num_pets is not None else "", 
                    "phone_number": clients.phone_number if clients.phone_number is not None else "", 
                    "favorite": clients.favorite 
                }
                for client in clients 
            ]
            
            return jsonify({
                "success": 1, 
                "data": clients_data, 
            }) 

        except SQLAlchemyError as e: 
            db.session.rollback()
            print(f"Database error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to get all clients. Database error"}),
            )     
    
    @classmethod 
    def delete_clients(cls, client_id_array):
        
        try: 
            ids_to_delete = [int(client_id) for client_id in client_id_array]    
            num_deleted = Client.query.filter(Client.id.in_(ids_to_delete)).delete(synchronize_session=False)
            db.session.commit()
            return jsonify({"success": 1, "num_deleted": num_deleted})
        except SQLAlchemyError as e: 
            db.session.rollback()
            print(f"Database error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to delete client(s). Database error"}),
            )  
        
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
    def update_vet_information(cls, client_id, fname, lname, primary_phone=None, secondary_phone=None, address=None, email=None):
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
    
    @classmethod 
    def edit_client_cost(cls, client_id, additional_costs_id, is_percentage, is_per_mile, reason, price_change, service_id=None):
        pass 
    
    @classmethod 
    def delete_client_cost(cls, client_id, additional_costs_id):
        pass 
    
    @classmethod 
    def edit_client_time(client_id, added_time_id, time_type_id, additional_time, notes, service_id=None):
        pass
    
    @classmethod 
    def delete_client_time(client_id, added_time_id):
        pass 
    
    @classmethod 
    def delete_client_documents(client_id, document_id):
        pass