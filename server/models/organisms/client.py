from models.db import db
from models.contact_info import ContactInfo 
from models.organisms.emergency_contact import EmergencyContact
from sqlalchemy.exc import SQLAlchemyError
from flask import jsonify
from sqlalchemy.orm import joinedload

class Client(db.Model):
    __tablename__ = 'clients'
     
    id = db.Column(db.Integer, primary_key = True) 
    contact_info_id = db.Column(db.Integer, db.ForeignKey('contact_info.id'), nullable=False)
    emergency_contact_id = db.Column(db.Integer, db.ForeignKey('emergency_contact.id'), nullable=True)
    fname = db.Column(db.String(50), nullable = False)
    lname = db.Column(db.String(50), nullable = False)
    num_pets = db.Column(db.Integer) 
    notes = db.Column(db.Text)
    favorite = db.Column(db.Integer)
    
    contact_info = db.relationship('ContactInfo', lazy='select')
    emergency_contact = db.relationship('EmergencyContact', backref='client', lazy='select', foreign_keys=[EmergencyContact.client_id])


    __table_args__ = (
        db.Index('idx_lname_fname_favorite', 'lname', 'fname'),
        db.Index('idx_favorite', 'favorite'),  # separate index for filtering by favorite only
    )
    # Add more details later 
    def __init__(self, fname, lname, contact_info, notes=None, num_pets=0, favorite=0):
        self.fname = fname
        self.lname = lname
        self.contact_info = contact_info
        self.notes = notes 
        self.num_pets = num_pets 
        self.favorite = favorite
    
    @classmethod 
    def create_client(cls, fname, lname, phone_number, email=None, street_address=None, city=None, state=None, zip=None, secondary_phone=None, notes = None, favorite=0):        
        contact = ContactInfo(primary_phone=phone_number, secondary_phone=secondary_phone, email=email, street_address=street_address, city=city, state=state, zip=zip)
        client = cls(fname=fname, lname=lname, contact_info=contact, notes=notes, favorite=favorite)
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
                jsonify({"success": 0, "error": "Failed to create client. Database error"}), 500,
            )
        except Exception as e: 
            db.session.rollback()
            print(f"Unknown error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to create client. Unknown error"}), 500,
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
            
            query = db.session.query(Client).options(
                joinedload(Client.contact_info).load_only(ContactInfo.primary_phone)  # Corrected this line
            )

            # Apply search criteria if provided
            if searchbar_chars:
                search_pattern = f"%{searchbar_chars}%"
                query = query.filter(
                    (Client.fname.ilike(search_pattern)) | 
                    (Client.lname.ilike(search_pattern))
                )

            # Order results alphabetically
            query = query.order_by(Client.fname.asc())

            # Paginate query
            pagination = query.paginate(page=page, per_page=page_size, error_out=False)
            clients = pagination.items
            
            # Send up data 
            clients_data = [
                {
                    "client_id": client.id, 
                    "fname": client.fname,
                    "lname": client.lname,
                    "num_pets": client.num_pets, 
                    "phone_number": client.contact_info.primary_phone, 
                    "favorite": client.favorite,
                }
                for client in clients 
            ]
            
            return jsonify({
                "success": 1, 
                "data": clients_data, 
                "total_pages": pagination.pages,
                "current_page": pagination.page
            }) 

        except SQLAlchemyError as e: 
            db.session.rollback()
            print(f"Database error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to get all clients. Database error"}), 500,
            )    
        except Exception as e: 
            db.session.rollback()
            print(f"Unknown error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to get all clients. Unknown error"}), 500, 
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
                jsonify({"success": 0, "error": "Failed to delete client(s). Database error"}), 500,
            ) 
        except Exception as e: 
            db.session.rollback()
            print(f"Unknown error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to delete client(s). Unknown error"}), 500, 
            )     
        
    @classmethod 
    def get_favorite_clients(cls): 
        try: 
            favorite_clients = Client.query.filter_by(favorite=1).all()
            clients_data = [
                {
                    "client_id": client.id, 
                    "fname": client.fname,
                    "lname": client.lname,
                    "num_pets": client.num_pets, 
                    "phone_number": client.contact_info.primary_phone, 
                    "favorite": client.favorite,
                }
                for client in favorite_clients 
            ]
            return jsonify({
                "success": 1, 
                "data": clients_data, 
            }) 
 
        except SQLAlchemyError as e: 
            db.session.rollback()
            print(f"Database error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to get favorited clients. Database error"}), 500,
            )  
        except Exception as e: 
            db.session.rollback()
            print(f"Unknown error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to get favorited clients. Unknown error"}), 500, 
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