from models.db import db
from models.contact_info import ContactInfo 
from sqlalchemy.exc import SQLAlchemyError
from flask import jsonify
from sqlalchemy.orm import joinedload

class Client(db.Model):
    __tablename__ = 'clients'
     
    id = db.Column(db.Integer, primary_key = True) 
    contact_info_id = db.Column(db.Integer, db.ForeignKey('contact_info.id'), nullable=False)
    fname = db.Column(db.String(50), nullable = False)
    lname = db.Column(db.String(50), nullable = False)
    num_pets = db.Column(db.Integer) 
    notes = db.Column(db.Text)
    favorite = db.Column(db.Integer)
    
    contact_info = db.relationship('ContactInfo', lazy='select')
    emergency_contacts = db.relationship('EmergencyContact', backref='client', lazy='select', foreign_keys='EmergencyContact.client_id')
    pets = db.relationship('Pet', backref='client', lazy='select', foreign_keys='Pet.client_id')
    vet = db.relationship('Vet', uselist=False, backref='client', lazy='select', foreign_keys='Vet.client_id')
    
    employee_id = db.Column(db.Integer, db.ForeignKey('employee.id'), nullable=True)  # Nullable if not all clients have an employee assigned
    typical_groomer = db.relationship('Employee', backref='clients', lazy='select', foreign_keys=[employee_id])
    
    online_payments_id = db.Column(db.Integer, db.ForeignKey('online_payments.id'), nullable=True)  # Nullable if not all clients have an employee assigned
    online_payments = db.relationship('OnlinePaymentIds', lazy='select')

    payment_types = db.relationship('ClientPaymentTypes', backref='client', lazy='select', foreign_keys='ClientPaymentTypes.client_id')

    additional_costs = db.relationship('AdditionalCosts', backref='client', lazy='select', foreign_keys='AdditionalCosts.client_id')
    added_time = db.relationship('AddedTime', backref='client', lazy='select', foreign_keys='AddedTime.client_id')

    files = db.relationship('ClientFiles', backref='client', lazy='select', foreign_keys='ClientFiles.client_id')


    __table_args__ = (
        db.Index('idx_client_id', 'id'),
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
        try: 
            # Return contact info and notes, emergency contact data, pet metadata 
            client = Client.query.options(
                joinedload(Client.vet),
                joinedload(Client.contact_info),
                joinedload(Client.emergency_contacts),
                joinedload(Client.pets),
                joinedload(Client.typical_groomer).load_only("fname", "lname", "id")
            ).filter_by(id=client_id).first()
            
            if client: 
                clients_data = {
                    "client_data": {
                        "client_id": client.id, 
                        "fname": client.fname,
                        "lname": client.lname,
                        "num_pets": client.num_pets, 
                        "favorite": client.favorite,
                        "notes": client.notes, 
                    }, 
                    "client_contact": {
                        "primary_phone": client.contact_info.primary_phone, 
                        "secondary_phone": client.contact_info.secondary_phone if client.contact_info.secondary_phone else "",
                        "street_address":  client.contact_info.street_address if client.contact_info.street_address else "", 
                        "city": client.contact_info.city if client.contact_info.city else "", 
                        "state": client.contact_info.state if client.contact_info.state else "", 
                        "zip": client.contact_info.zip if client.contact_info.zip else "", 
                        "email": client.contact_info.email if client.contact_info.email else "",
                    },
                    "client_vet": {
                        "fname": client.vet.fname if client.vet else "",
                        "lname": client.vet.lname if client.vet else "", 
                        "notes": client.vet.notes if client.vet else "",
                        "primary_phone": client.vet.primary_phone if client.vet else "", 
                        "secondary_phone": client.vet.secondary_phone if client.vet else "",
                        "street_address": client.vet.street_address if client.vet else "",
                        "city": client.vet.city if client.vet else "",
                        "state": client.vet.state if client.vet else "",
                        "zip": client.vet.zip if client.vet else "",
                        "email": client.vet.email if client.vet else "",
                    },
                    "typical_groomer": {
                        "groomer_fname": client.typical_groomer.fname if client.typical_groomer else "",
                        "groomer_lname": client.typical_groomer.lname if client.typical_groomer else "",
                        "employee_id": client.typical_groomer.id if client.typical_groomer else -1, 
                    },
                    "emergency_contacts": [], 
                    "pets": []
                }
                for ec in client.emergency_contacts:
                    ec_info = {
                        "emergency_contact_id": ec.id,
                        "fname": ec.fname,
                        "lname": ec.lname,
                        "relationship": ec.relationship,
                        "primary_phone": ec.contact_info.primary_phone, 
                        "secondary_phone": ec.contact_info.secondary_phone if ec.contact_info.secondary_phone else "", 
                        "street_address": ec.contact_info.street_address if ec.contact_info.street_address else "", 
                        "city": ec.contact_info.city if ec.contact_info.city else "", 
                        "state": ec.contact_info.state if ec.contact_info.state else "", 
                        "zip": ec.contact_info.zip if ec.contact_info.zip else "", 
                        "email": ec.contact_info.email if ec.contact_info.email else "",
                    }
                    clients_data["emergency_contacts"].append(ec_info)
                
                for p in client.pets:
                    pet_info = {
                        "pet_id": p.id, 
                        "name": p.name, 
                        "age": p.age if p.age else -1, 
                        "breed": p.breed if p.breed else "", 
                    }
                    clients_data["pets"].append(pet_info)
                
                return jsonify({
                    "success": 1, 
                    "data": clients_data, 
                }) 
            else: 
                return jsonify({
                    "success": 0, 
                    "error": "No client found for client id: " + client_id, 
                }) 

        except SQLAlchemyError as e:
            db.session.rollback()
            print(f"Database error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to fetch client data. Database error"}), 500,
            )
        except Exception as e: 
            db.session.rollback()
            print(f"Unknown error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to fetch client data. Unknown error"}), 500,
            )  
        

            
    @classmethod 
    def get_cost_and_time_stats_metadata(cls, client_id):
        try: 
            client = Client.query.options(
                joinedload(Client.online_payments),
                joinedload(Client.payment_types),
                joinedload(Client.additional_costs),
                joinedload(Client.added_time),
            ).filter_by(id=client_id).first() 
            
            if client: 
                clients_data = {
                    "client_online_payments": {
                        "zelle_id": client.online_payments.zelle_user if client.online_payments else "", 
                        "paypal_id": client.online_payments.paypal_user if client.online_payments else "",
                        "venmo_id": client.online_payments.venmo_user if client.online_payments else "",
                    },
                    "payment_methods": [],
                    "added_cost_per_service": [],
                    "added_cost_travel": [],
                    "added_cost_other": [],
                    "added_time_per_service": [],
                    "added_time_other": [],
                }
                
                for p in client.payment_types:
                    payments = {
                        "payment_type": p.payment_type.payment_type, 
                    }
                    clients_data["payment_methods"].append(payments)
                
                for a in client.additional_costs:
                    if a.added_for_service == 1: 
                        service_addition = {
                            "service_name": a.service.name, 
                            "added_cost": a.added_cost,
                            "is_percentage": a.is_percentage,
                            "reason": a.reason if a.reason else "",
                        }
                        clients_data["added_cost_per_service"].append(service_addition)
                    if a.added_for_mile == 1: 
                        mile_addition = {
                            "added_cost_per_mile": a.added_cost_per_mile, 
                            "is_percentage": a.added_cost_per_mile_is_percent, 
                            "reason": a.reason if a.reason else "",
                        }
                        clients_data["added_cost_travel"].append(mile_addition)
                    else: 
                        other_addition = {
                            "added_cost": a.added_cost,
                            "is_percentage": a.is_percentage,
                            "reason": a.reasonm if a.reason else "",
                        }
                        clients_data["added_cost_other"].append(other_addition)
                        
                for t in client.added_time:
                    if t.added_for_service == 1: 
                        time_data = {
                            "service_name": t.service.name, 
                            "additional_time": t.additional_time, 
                            "time_type": "minutes", 
                            "reason": t.reason if t.reason else "",
                        }
                        clients_data["added_time_per_service"].append(time_data)
                    else: 
                        time_data = {
                            "additional_time": t.additional_time, 
                            "time_type": "minutes", 
                            "reason": t.reason if t.reason else "",
                        }
                        clients_data["added_time_other"].append(time_data)
                
                return jsonify({
                    "success": 1, 
                    "data": clients_data, 
                }) 
                
            else:
                return jsonify({
                    "success": 0, 
                    "error": "No client found for client id: " + client_id, 
                }) 

        except SQLAlchemyError as e:
            db.session.rollback()
            print(f"Database error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to fetch client cost and time data. Database error"}), 500,
            )
        except Exception as e: 
            db.session.rollback()
            print(f"Unknown error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to fetch client cost and time data. Unknown error"}), 500,
            )  
    
    @classmethod 
    def get_appointment_metadata(cls, client_id):
        # returns upcoming appointments, past appointments, appointment stats 
        pass
    
    @classmethod 
    def get_client_document_metadata(cls, client_id):
        try: 
            client = Client.query.options(
                joinedload(Client.files)
            ).filter_by(id=client_id).first()       
        
            if client: 
                clients_data = {
                    "documents":[]
                }
                
                for d in client.files:
                    files = {
                        "id": d.id,  
                        "name": d.document_name,
                        "pet_id": d.pet_id if d.pet_id else -1, 
                        "appointment_id": d.appointment_id if d.appointment_id else -1, 
                        "document_type": d.document_type,
                        "description": d.description if d.description else "", 
                    }
                    clients_data["documents"].append(files)
                    
                return jsonify({
                    "success": 1, 
                    "data": clients_data, 
                }) 
            else:
                return jsonify({
                    "success": 0, 
                    "error": "No client found for client id: " + client_id, 
                }) 

        except SQLAlchemyError as e:
            db.session.rollback()
            print(f"Database error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to fetch client cost and time data. Database error"}), 500,
            )
        except Exception as e: 
            db.session.rollback()
            print(f"Unknown error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to fetch client cost and time data. Unknown error"}), 500,
            )  
       
    
    
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