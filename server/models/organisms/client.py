from models.db import db
from models.contact_info import ContactInfo 
from models.logistics.appointment import Appointment
from datetime import datetime
from sqlalchemy.exc import SQLAlchemyError
from flask import jsonify, send_from_directory
from sqlalchemy.orm import joinedload
from dotenv import load_dotenv
import os 
from PIL import Image
from werkzeug.utils import secure_filename

class Client(db.Model):
    __tablename__ = 'clients'
     
    id = db.Column(db.Integer, primary_key = True) 
    contact_info_id = db.Column(db.Integer, db.ForeignKey('contact_info.id'), nullable=False)
    fname = db.Column(db.String(50), nullable = False)
    lname = db.Column(db.String(50), nullable = False)
    num_pets = db.Column(db.Integer) 
    notes = db.Column(db.Text)
    favorite = db.Column(db.Integer)
    
    profile_pic_url = db.Column(db.String(50), default="")
    
    contact_info_id = db.Column(db.Integer, db.ForeignKey('contact_info.id'), nullable=False)
    contact_info = db.relationship('ContactInfo', lazy='select', cascade="all, delete", single_parent=True, uselist=False, foreign_keys=[contact_info_id])
    
    emergency_contacts = db.relationship('EmergencyContact', backref='client', lazy='select', cascade='all, delete-orphan', foreign_keys='EmergencyContact.client_id')
    
    pets = db.relationship('Pet', backref='client', lazy='select', cascade='all, delete-orphan', foreign_keys='Pet.client_id')
    
    vet = db.relationship('Vet', uselist=True, backref='client', cascade="all, delete", single_parent=True, lazy='select', foreign_keys='Vet.client_id')
    
    appointments = db.relationship('Appointment', backref='client', lazy='select', foreign_keys='Appointment.client_id')
    appointment_stats = db.relationship('AppointmentStats', backref='client', lazy='select', uselist=False, cascade="all, delete", single_parent=True, foreign_keys='AppointmentStats.client_id')

    # online_payments_id = db.Column(db.Integer, db.ForeignKey('online_payments.id'), nullable=True)  # Nullable if not all clients have an employee assigned
    # online_payments = db.relationship('OnlinePaymentIds', lazy='select', cascade="all, delete", single_parent=True, foreign_keys=[online_payments_id])

    payment_types = db.relationship('ClientPaymentTypes', backref='client', lazy='select', cascade="all, delete", single_parent=True, foreign_keys='ClientPaymentTypes.client_id')

    additional_costs = db.relationship('AdditionalCosts', backref='client', lazy='select',  uselist=False, cascade="all, delete", single_parent=True, foreign_keys='AdditionalCosts.client_id')
    added_time = db.relationship('AddedTime', backref='client', lazy='select',  uselist=False, cascade="all, delete", single_parent=True, foreign_keys='AddedTime.client_id')

    files = db.relationship('ClientFiles', backref='client', lazy='select', uselist=False, cascade="all, delete", single_parent=True, foreign_keys='ClientFiles.client_id')


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
            ).filter_by(id=client_id).first()

            if client: 
                clients_data = {
                    "client_data": {
                        "client_id": client.id, 
                        "fname": client.fname,
                        "lname": client.lname,
                        "num_pets": client.num_pets, 
                        "favorite": client.favorite,
                        "notes": client.notes if client.notes else "", 
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
                    # "typical_groomer": {},
                    "emergency_contacts": [], 
                    "pets": [],
                    "client_vets": []
                }
                
                # if client.typical_groomer: 
                #     clients_data['typical_groomer'] = {
                #         "groomer_fname": client.typical_groomer.fname if client.typical_groomer else "",
                #         "groomer_lname": client.typical_groomer.lname if client.typical_groomer else "",
                #         "employee_id": client.typical_groomer.id if client.typical_groomer else -1, 
                #     }
                
                for vet in client.vet: 
                    vet_info = {
                        "fname": getattr(vet, "fname"),
                        "lname": getattr(vet, "lname"),
                        "notes": vet.notes if vet.notes else "",
                        "primary_phone": vet.contact_info.primary_phone if vet.contact_info.primary_phone else "",
                        "secondary_phone": vet.contact_info.secondary_phone if vet.contact_info.secondary_phone else "",#getattr(vet.contact_info, "secondary_phone", ""),
                        "street_address": vet.contact_info.street_address if vet.contact_info.street_address else "",
                        "city": vet.contact_info.city if vet.contact_info.city else "",
                        "state": vet.contact_info.state if vet.contact_info.state else "",
                        "zip": vet.contact_info.zip if vet.contact_info.zip else "",
                        "email": vet.contact_info.email if vet.contact_info.email else ""
                    }
                    clients_data["client_vets"].append(vet_info)
                
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
                        "breed": p.breed.name if p.breed else "", 
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
                        "payment_type_id": p.payment_type.id,
                    }
                    clients_data["payment_methods"].append(payments)
                
                if client.additional_costs: 
                    for a in client.additional_costs:
                        if a.added_for_service == 1: 
                            service_addition = {
                                "id": a.id, 
                                "service_name": a.service.name, 
                                "added_cost": a.added_cost,
                                "is_percentage": a.is_percentage,
                                "reason": a.reason if a.reason else "",
                            }
                            clients_data["added_cost_per_service"].append(service_addition)
                        if a.added_for_mile == 1: 
                            mile_addition = {
                                "id": a.id, 
                                "added_cost_per_mile": a.added_cost_per_mile, 
                                "is_percentage": a.added_cost_per_mile_is_percent, 
                                "reason": a.reason if a.reason else "",
                            }
                            clients_data["added_cost_travel"].append(mile_addition)
                        else: 
                            other_addition = {
                                "id": a.id, 
                                "added_cost": a.added_cost,
                                "is_percentage": a.is_percentage,
                                "reason": a.reasonm if a.reason else "",
                            }
                            clients_data["added_cost_other"].append(other_addition)
                   
                if client.added_time:      
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
        try: 
            client = Client.query.options(
                joinedload(Client.appointments),
                joinedload(Client.appointment_stats)
            ).filter_by(id=client_id).first() 
            
            if client: 
                now = datetime.now().date()

                upcoming_appointments = (
                    db.session.query(Appointment)
                    .filter(Appointment.client_id == client.id, Appointment.date > now)
                    .order_by(Appointment.date.asc())
                    .all()
                )

                past_appointments_preview = (
                    db.session.query(Appointment)
                    .filter(Appointment.client_id == client.id, Appointment.date <= now)
                    .order_by(Appointment.date.desc())
                    .limit(3)
                    .all()
                )
                
                saved_appointments = (
                    db.session.query(Appointment)
                    .filter(
                        Appointment.client_id == client.id,
                        Appointment.type == "saved"
                    )
                    .order_by(Appointment.date.desc())  # Optional: order by latest
                    .all()
                )
                
                recurring_appointments = (
                    db.session.query(Appointment)
                    .filter(
                        Appointment.client_id == client.id,
                        Appointment.type == "recurring"
                    )
                    .order_by(Appointment.date.desc())  # Optional: order by latest
                    .all()
                )
                            
                clients_data = {
                    "appointment_stats": {
                        "num_late": client.appointment_stats.late if client.appointment_stats else 0,
                        "num_no_shows": client.appointment_stats.no_shows if client.appointment_stats else 0, 
                        "num_cancelled": client.appointment_stats.cancelled if client.appointment_stats else 0, 
                        "num_cancelled_late": client.appointment_stats.cancelled_late if client.appointment_stats else 0,  
                    },
                    "recurring_appointments": [],
                    "upcoming_non_recurring_appointments": [],
                    "past_appointments_preview": [],
                    "saved_appointment_config": [],
                }
                
                for up in upcoming_appointments:
                    if up.type=="single": 
                        upcoming = {
                            "id": up.id,
                            "date": up.date.strftime('%Y-%m-%d'), 
                            "start_time": up.start_time, 
                            "end_time": up.end_time, 
                        }
                        clients_data["upcoming_appointments"].append(upcoming)
                        
                for recur in recurring_appointments: 
                    recurring = {
                        "id": recur.id,
                        "start_recur_date": recur.start_recur_date.strftime('%Y-%m-%d') if recur.start_recur_date else "", 
                        "end_recur_date": recur.end_recur_date.strftime('%Y-%m-%d') if recur.end_recur_date else "",
                        "start_time": recur.start_time, 
                        "end_time": recur.end_time, 
                    }
                    clients_data["recurring_appointments"].append(recurring)

                for saved in saved_appointments: 
                    save = {
                        "id": saved.id, 
                        "saved_appointment_name": saved.saved_appointment_config_name, 
                    }
                    clients_data["saved_appointment_config"].append(save)
                    
                for p in past_appointments_preview: 
                    past = {
                        "id": p.id,
                        "date": p.date.strftime('%Y-%m-%d'), 
                        "start_time": p.start_time.strftime('%H:%M:%S'), 
                        "end_time": p.end_time.strftime('%H:%M:%S'), 
                        "appointment_status": p.appointment_status if p.appointment_status else "", 
                        "payment_status": p.payment_status if p.payment_status else "",
                    }
                    clients_data["past_appointments_preview"].append(past)
                    
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
                jsonify({"success": 0, "error": "Failed to fetch client appointment data. Database error"}), 500,
            )
        except Exception as e: 
            db.session.rollback()
            print(f"Unknown error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to fetch client appointment data. Unknown error"}), 500,
            )  
    
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
            
            query = db.session.query(Client)

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
            num_deleted = 0

            for client_id in ids_to_delete:
                client = Client.query.get(client_id)
                if client:
                    db.session.delete(client)
                    num_deleted += 1

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
    def upload_profile_picture(cls, client_id, image, filename, ext):
        try: 
            
            load_dotenv()
            image_store = os.environ.get('IMAGESTORE_URL')  # e.g., '/static/uploads/' or cloud URL

            # Secure the filename and save the image to disk
            secure_name = secure_filename(filename)
            local_path = os.path.join(image_store, client_id, secure_name)
            os.makedirs(os.path.dirname(local_path), exist_ok=True)

            # Save the FileStorage image to the local path
            image.save(local_path)

            # Resize the image
            img = Image.open(local_path)
            img.thumbnail((512, 512))  # Resize to 512x512

            # Save the resized image (overwrite or create new file)
            img.save(local_path, format=ext, quality=85)

            # Construct the final image URL
            image_url = secure_name

            # Update client record in DB
            client = Client.query.get(client_id)
            if not client:
                return jsonify({
                    "success": 0, 
                    "error": "Client not found"
                }) 
            client.profile_pic_url = image_url
            db.session.commit()

            return jsonify({
                "success": 1, 
                "client_id": client_id,
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
    def get_profile_picture(cls, client_id):
        try: 
            load_dotenv()
            image_store = os.environ.get('IMAGESTORE_URL').strip()
            
            client = Client.query.with_entities(Client.profile_pic_url).filter_by(id=client_id).first()
            
            if not client or client.profile_pic_url == "":
                return jsonify({"success": 1, "exists": 0, "message": "No profile picture associated with this user."}), 404

            
            image_dir = os.path.join(image_store, client_id)
            
            full_path = os.path.join(image_dir, client.profile_pic_url)
            if not os.path.exists(full_path):
                return jsonify({"success": 0, "error": "Image URL associated with this user does not map to an image in the image store."}), 404
            
            return send_from_directory(image_dir, client.profile_pic_url)
            
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
    def delete_profile_picture(cls, client_id):
        try: 
            load_dotenv()
            image_store = os.environ.get('IMAGESTORE_URL').strip()
            image_dir = os.path.join(image_store, client_id)

            client = Client.query.filter_by(id=client_id).first()
            if not client:
                return jsonify({
                    "success": 0, 
                    "error": "Client not found"
                }) 
            
            full_path = os.path.join(image_dir, client.profile_pic_url)
            if not os.path.exists(full_path):
                return jsonify({"success": 0, "error": "Image URL associated with this user does not map to an image in the image store."}), 404
            
            if os.path.isfile(full_path):
                os.remove(full_path)
            else:
                return jsonify({"success": 0, "error": "Path does not point to a file."}), 404
            
            client.profile_pic_url = ""
            db.session.commit()
            return jsonify({"success": 1, "error": "Successfully deleted profile picture for this user"}), 404

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

        
    # @classmethod 
    # def get_favorite_clients(cls): 
    #     try: 
    #         favorite_clients = Client.query.filter_by(favorite=1).all()
    #         clients_data = [
    #             {
    #                 "client_id": client.id, 
    #                 "fname": client.fname,
    #                 "lname": client.lname,
    #                 "num_pets": client.num_pets, 
    #                 "phone_number": client.contact_info.primary_phone, 
    #                 "favorite": client.favorite,
    #             }
    #             for client in favorite_clients 
    #         ]
    #         return jsonify({
    #             "success": 1, 
    #             "data": clients_data, 
    #         }) 
 
    #     except SQLAlchemyError as e: 
    #         db.session.rollback()
    #         print(f"Database error: {e}")
    #         return (
    #             jsonify({"success": 0, "error": "Failed to get favorited clients. Database error"}), 500,
    #         )  
    #     except Exception as e: 
    #         db.session.rollback()
    #         print(f"Unknown error: {e}")
    #         return (
    #             jsonify({"success": 0, "error": "Failed to get favorited clients. Unknown error"}), 500, 
    #         )   
            
    @classmethod 
    def edit_client_contact(cls, **kwargs):
        client_id = kwargs.get('client_id')
        
        try: 
            client = Client.query.options(
                joinedload(Client.contact_info),
            ).filter_by(id=client_id).first()
            
            if client:                
                for field in ['primary_phone', 'secondary_phone', 'email', 'street_address', 'city', 'state', 'zip']:
                    if field in kwargs:
                        setattr(client.contact_info, field, kwargs[field])

                db.session.commit()
                return jsonify({
                    "success": 1, 
                    "message": "Client contact updated succesfully",
                    "client_id": client_id
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
                jsonify({"success": 0, "error": "Failed to update client contact. Database error"}), 500,
            )  
        except Exception as e: 
            db.session.rollback()
            print(f"Unknown error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to update client contact. Unknown error"}), 500, 
            )   
    @classmethod 
    def edit_client_basic_data(cls, **kwargs):
        client_id = kwargs.get('client_id')
        
        try: 
            client = cls.query.filter_by(id=client_id).first()

            if client:                
                for field in ['fname', 'lname', 'notes']:
                    if field in kwargs:
                        setattr(client, field, kwargs[field])

                db.session.commit()
                return jsonify({
                    "success": 1, 
                    "message": "Client basic data updated succesfully",
                    "client_id": client_id
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
                jsonify({"success": 0, "error": "Failed to update client basic data. Database error"}), 500,
            )  
        except Exception as e: 
            db.session.rollback()
            print(f"Unknown error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to update client basic data. Unknown error"}), 500, 
            )
       
    
    @classmethod 
    def update_client_is_favorite(cls, client_id, favorite):
        try: 
            client = cls.query.filter_by(id=client_id).first()
            if client and favorite: 
                client.favorite = favorite 
                db.session.commit()
                return jsonify({
                    "success": 1, 
                    "message": "Client favorite data succesfully updated",
                    "client_id": client_id
                })
            else:  
                return jsonify({
                    "success": 0, 
                    "error": "Either no client found for client id: " + client_id + " or favorite attribute not provided", 
                }) 
        except SQLAlchemyError as e: 
            db.session.rollback()
            print(f"Database error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to update client basic data. Database error"}), 500,
            )  
        except Exception as e: 
            db.session.rollback()
            print(f"Unknown error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to update client basic data. Unknown error"}), 500, 
            )
    

    
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