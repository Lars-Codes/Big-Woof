import base64
from models.db import db
from models.contact_info import ContactInfo 
from models.logistics.appointment import Appointment
# from models.organisms.pet import Pet 
from datetime import datetime
from sqlalchemy.exc import SQLAlchemyError
from flask import jsonify, send_from_directory
from sqlalchemy.orm import joinedload
from dotenv import load_dotenv
import os 
from werkzeug.utils import secure_filename
from PIL import Image, ImageDraw, ImageFont
import random 
import shutil
import colorsys

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
    
    pets = db.relationship('Pet', back_populates='client', lazy='select', cascade='all, delete-orphan', foreign_keys='Pet.client_id')
    
    vet = db.relationship('Vet', uselist=True, backref='client', cascade="all, delete", single_parent=True, lazy='select', foreign_keys='Vet.client_id')
    
    appointments = db.relationship('Appointment', backref='client', lazy='select', cascade='all, delete-orphan', foreign_keys='Appointment.client_id')
    appointment_stats = db.relationship('AppointmentStats', backref='client', lazy='select', uselist=False, cascade="all, delete", single_parent=True, foreign_keys='AppointmentStats.client_id')

    # online_payments_id = db.Column(db.Integer, db.ForeignKey('online_payments.id'), nullable=True)  # Nullable if not all clients have an employee assigned
    # online_payments = db.relationship('OnlinePaymentIds', lazy='select', cascade="all, delete", single_parent=True, foreign_keys=[online_payments_id])

    payment_types = db.relationship('ClientPaymentTypes', backref='client', lazy='select', cascade="all, delete", single_parent=True, foreign_keys='ClientPaymentTypes.client_id')

    additional_costs = db.relationship('AdditionalCosts', backref='client', lazy='select',  uselist=False, cascade="all, delete", single_parent=True, foreign_keys='AdditionalCosts.client_id')
    added_time = db.relationship('AddedTime', backref='client', lazy='select',  uselist=False, cascade="all, delete", single_parent=True, foreign_keys='AddedTime.client_id')

    files = db.relationship('ClientFiles', backref='client', lazy='select', cascade="all, delete-orphan", foreign_keys='ClientFiles.client_id')
    sticky_notes = db.relationship('StickyNotes', backref='client', lazy='select', cascade="all, delete-orphan", foreign_keys='StickyNotes.client_id')


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
            
            filename = "profile-" + str(client.id) + ".jpg"
            
            response = Client.upload_profile_picture(client.id, image=None, filename=filename, ext="jpg", initial_generation=1)
            # print(response)
            # if response.get("success") == 0:
            #     print("Error generating profile picture.")
            # else: 
            #     print(response) 
            
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
                    "client_vets": [], 
                    "sticky_notes": [],
                }
                
                # if client.typical_groomer: 
                #     clients_data['typical_groomer'] = {
                #         "groomer_fname": client.typical_groomer.fname if client.typical_groomer else "",
                #         "groomer_lname": client.typical_groomer.lname if client.typical_groomer else "",
                #         "employee_id": client.typical_groomer.id if client.typical_groomer else -1, 
                #     }
                
                for sticky in client.sticky_notes: 
                    if sticky.pet_id==None: 
                        sticky_note = {
                            "id": sticky.id, 
                            "note": sticky.note if sticky.note else "", 
                            "date": sticky.date if sticky.date else ""
                        }
                        clients_data["sticky_notes"].append(sticky_note)
                    
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
                # joinedload(Client.online_payments),
                joinedload(Client.payment_types),
                joinedload(Client.additional_costs),
                joinedload(Client.added_time),
            ).filter_by(id=client_id).first() 
            
            if client: 
                clients_data = {
                    # "client_online_payments": {
                    #     "zelle_id": client.online_payments.zelle_user if client.online_payments else "", 
                    #     "paypal_id": client.online_payments.paypal_user if client.online_payments else "",
                    #     "venmo_id": client.online_payments.venmo_user if client.online_payments else "",
                    # },
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
                                "reason": a.reason if a.reason else "",
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
    def get_pet_appointment_metdata(cls, client, pet_id):
        try: 
            
            now = datetime.now().date()

            upcoming_appointments = (
                db.session.query(Appointment)
                .filter(Appointment.client_id == client.id, Appointment.pet_id==pet_id, Appointment.date > now)
                .order_by(Appointment.date.asc())
                .all()
            )

            past_appointments_preview = (
                db.session.query(Appointment)
                .filter(Appointment.client_id == client.id, Appointment.pet_id==pet_id, Appointment.date <= now)
                .order_by(Appointment.date.desc())
                .limit(3)
                .all()
            )
            
            saved_appointments = (
                db.session.query(Appointment)
                .filter(
                    Appointment.client_id == client.id,
                    Appointment.pet_id==pet_id,
                    Appointment.type == "saved"
                )
                .order_by(Appointment.date.desc())  # Optional: order by latest
                .all()
            )
            
            recurring_appointments = (
                db.session.query(Appointment)
                .filter(
                    Appointment.client_id == client.id,
                    Appointment.pet_id==pet_id,
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
                        "date": up.date.strftime('%Y-%m-%d') if up.date else "", 
                        "start_time": up.start_time.strftime('%H:%M:%S') if up.start_time else "", 
                        "end_time": up.end_time.strftime('%H:%M:%S') if up.end_time else "", 
                    }
                    clients_data["upcoming_non_recurring_appointments"].append(upcoming)
                    
            for recur in recurring_appointments: 
                recurring = {
                    "id": recur.id,
                    "start_recur_date": recur.start_recur_date.strftime('%Y-%m-%d') if recur.start_recur_date else "", 
                    "end_recur_date": recur.end_recur_date.strftime('%Y-%m-%d') if recur.end_recur_date else "",
                    "start_time": recur.start_time.strftime('%H:%M:%S') if recur.start_time else "", 
                    "end_time": recur.end_time.strftime('%H:%M:%S') if recur.end_time else "", 
                }
                clients_data["recurring_appointments"].append(recurring)

            for saved in saved_appointments: 
                save = {
                    "id": saved.id, 
                    "saved_appointment_name": saved.saved_appointment_config_name if saved.saved_appointment_config_name else "", 
                }
                clients_data["saved_appointment_config"].append(save)
                
            for p in past_appointments_preview: 
                past = {
                    "id": p.id,
                    "date": p.date.strftime('%Y-%m-%d') if p.date else "", 
                    "start_time": p.start_time.strftime('%H:%M:%S') if p.start_time else "", 
                    "end_time": p.end_time.strftime('%H:%M:%S') if p.end_time else "", 
                    "appointment_status": p.appointment_status if p.appointment_status else "", 
                    "payment_status": p.payment_status if p.payment_status else "",
                }
                clients_data["past_appointments_preview"].append(past)
                
            return jsonify({
                "success": 1, 
                "data": clients_data, 
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
    def get_appointment_metadata(cls, client_id, pet_id=None):
        # returns upcoming appointments, past appointments, appointment stats
        try: 
            client = Client.query.options(
                joinedload(Client.appointments),
                joinedload(Client.appointment_stats)
            ).filter_by(id=client_id).first() 
            
            if client: 
                if pet_id!=None: 
                    return cls.get_pet_appointment_metdata(client, pet_id)
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
                            "date": up.date.strftime('%Y-%m-%d') if up.date else "", 
                            "start_time": up.start_time.strftime('%H:%M:%S') if up.start_time else "", 
                            "end_time": up.end_time.strftime('%H:%M:%S') if up.end_time else "", 
                        }
                        clients_data["upcoming_non_recurring_appointments"].append(upcoming)
                        
                for recur in recurring_appointments: 
                    recurring = {
                        "id": recur.id,
                        "start_recur_date": recur.start_recur_date.strftime('%Y-%m-%d') if recur.start_recur_date else "", 
                        "end_recur_date": recur.end_recur_date.strftime('%Y-%m-%d') if recur.end_recur_date else "",
                        "start_time": recur.start_time.strftime('%H:%M:%S') if recur.start_time else "", 
                        "end_time": recur.end_time.strftime('%H:%M:%S') if recur.end_time else "", 
                    }
                    clients_data["recurring_appointments"].append(recurring)

                for saved in saved_appointments: 
                    save = {
                        "id": saved.id, 
                        "saved_appointment_name": saved.saved_appointment_config_name if saved.saved_appointment_config_name else "", 
                    }
                    clients_data["saved_appointment_config"].append(save)
                    
                for p in past_appointments_preview: 
                    past = {
                        "id": p.id,
                        "date": p.date.strftime('%Y-%m-%d') if p.date else "", 
                        "start_time": p.start_time.strftime('%H:%M:%S') if p.start_time else "", 
                        "end_time": p.end_time.strftime('%H:%M:%S') if p.end_time else "", 
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
                    "error": "No client found for client id: " + str(client_id), 
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
    def get_client_document_metadata(cls, client_id, pet_id=None):
        try: 
            
            client = Client.query.options(
                joinedload(Client.files)
            ).filter_by(id=client_id).first()       
                    
            if client: 
                clients_data = {
                    "documents": []
                }
                if client.files: 
                    for d in client.files:
                        if (pet_id!=None and not d.pet_id) or (pet_id!=None and int(d.pet_id)!=int(pet_id)): 
                            continue 
                        files = {
                            "id": d.id,  
                            "pet_id": d.pet_id if d.pet_id else -1, 
                            "appointment_id": d.appointment_id if d.appointment_id else -1, 
                            "document_type": d.document_type if d.document_type else "",
                            "description": d.description if d.description else "", 
                            "document_name": d.document_name if d.document_name else "", 
                            "initial_filename": d.initial_filename if d.initial_filename else "", 
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
                jsonify({"success": 0, "error": "Failed to fetch client document data. Database error"}), 500,
            )
        except Exception as e: 
            db.session.rollback()
            print(f"Unknown error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to fetch client document data. Unknown error"}), 500,
            )  
       
    
    
    @classmethod 
    def get_all_clients(cls): 
        try: 
            clients = db.session.query(Client).order_by(Client.fname.asc()).all()
            
            # Prepare data
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
                "data": clients_data
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
                print(client_id)
                client = Client.query.get(client_id)
                if client:
                    db.session.delete(client)
                    num_deleted += 1
                    
                    profile_pic_path = client.profile_pic_url
                    load_dotenv()
                    image_store = os.environ.get('IMAGESTORE_URL')  # e.g., '/static/uploads/' or cloud URL
                    secure_name = secure_filename(profile_pic_path)
                    local_path = os.path.join(image_store, str(client_id), secure_name)
                    
                    file_store = os.environ.get('FILESTORE_URL')
                    path_to_client_files = os.path.join(file_store, str(client_id))

                    if os.path.isdir(path_to_client_files):
                        shutil.rmtree(path_to_client_files)

                    if os.path.isfile(local_path):
                        os.remove(local_path)
                        # 2. Get the parent directory
                        parent_dir = os.path.dirname(local_path)

                        # 3. If the directory is now empty, delete it
                        if os.path.isdir(parent_dir) and not os.listdir(parent_dir):
                            os.rmdir(parent_dir)
                            
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
    def upload_profile_picture(cls, client_id, image, filename, ext, initial_generation=0):
        try:    
            accepted_formats = ['jpg', 'png', 'jpeg']
            if ext.lower() not in accepted_formats: 
                return jsonify({
                    "success": 0, 
                    "error": "Image needs to have ext jpg, png, or jpeg"
                }) 
            
            client = Client.query.get(client_id)
            if not client:
                return jsonify({
                    "success": 0, 
                    "error": "Client not found"
                }) 
                
            load_dotenv()
            image_store = os.environ.get('IMAGESTORE_URL')  # e.g., '/static/uploads/' or cloud URL

            # Secure the filename and save the image to disk
            secure_name = secure_filename(filename)
            local_path = os.path.join(image_store, str(client_id), secure_name)
            os.makedirs(os.path.dirname(local_path), exist_ok=True)

            if initial_generation == 1: 
                initials = client.fname[0].upper() + client.lname[0].upper()
                img_size = 512
                font_size = int(img_size * 0.8)  # Start much bigger - 80% of image size
                # Generate background color
                # base_color = [random.randint(0, 255) for _ in range(3)]
                # pastel_color = tuple(int(c * 0.25 + 255 * 0.75) for c in base_color)  # 75% white blend
                # background_color = pastel_color
                # r, g, b = background_color
                h = random.random()  # Hue: 0.0 to 1.0
                s = 0.7              # Saturation: lower = more pastel
                l = 0.75             # Lightness: higher = lighter

                # Convert HLS to RGB (colorsys uses 0-1 scale)
                r, g, b = colorsys.hls_to_rgb(h, l, s)

                # Convert to 0–255 range
                r, g, b = [int(x * 255) for x in (r, g, b)]
                background_color = (r, g, b)
                # Create the image
                image = Image.new('RGB', (img_size, img_size), background_color)
                draw = ImageDraw.Draw(image)

                # Use the specific Helvetica font
                try:
                    # Get the directory where this client.py file is located
                    current_dir = os.path.dirname(os.path.abspath(__file__))
                    # Navigate up to server directory, then to fonts
                    font_path = os.path.join(current_dir, '..', '..', 'fonts', 'HelveticaNeueMedium.otf')
                    font_path = os.path.normpath(font_path)  # Clean up the path
                    
                    # Load the font with initial size
                    font = ImageFont.truetype(font_path, font_size)
                except Exception as e:
                    print(f"Could not load font: {e}")
                    font = ImageFont.load_default()
            
                # Get text bounding box and adjust font size
                bbox = draw.textbbox((0, 0), initials, font=font)
                text_width = bbox[2] - bbox[0]
                text_height = bbox[3] - bbox[1]
                
                # Target 60% of image size for the text
                target_size = img_size * 0.6
                current_max_size = max(text_width, text_height)
                
                # Always scale to target size
                scale_factor = target_size / current_max_size
                new_font_size = int(font_size * scale_factor)
                
                try:
                    font = ImageFont.truetype(font_path, new_font_size)
                except:
                    font = ImageFont.load_default()
                
                # Recalculate bounding box with new font
                bbox = draw.textbbox((0, 0), initials, font=font)
                text_width = bbox[2] - bbox[0]
                text_height = bbox[3] - bbox[1]
            
                # Center the text
                x = (img_size - text_width) / 2
                y = (img_size - text_height) / 2
            
                # Choose text color based on luminance
                luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
                text_color = (255, 255, 255) if luminance < 0.5 else (0, 0, 0)
            
                draw.text((x, y), initials, font=font, fill=text_color)

                # Save the generated image
                image.save(local_path)
            else:
                # Handle uploaded image
                if not image:
                    return jsonify({
                        "success": 0, 
                        "error": "Image file is required when not generating initial profile picture"
                    }) 

                # Save the FileStorage image to the local path
                image.save(local_path)

                # Resize the image
                img = Image.open(local_path)
                img.thumbnail((512, 512))  # Resize to 512x512

                format_map = {
                    "jpg": "JPEG",
                    "jpeg": "JPEG",
                    "png": "PNG",
                }

                format_str = format_map.get(ext.lower(), ext.upper())

                # Save the resized image (overwrite or create new file)
                img.save(local_path, format=format_str, quality=85)

            # Construct the final image URL
            image_url = secure_name

            # Update client record in DB
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
                jsonify({"success": 0, "error": "Failed to upload profile picture. Database error"})
            ) 
        except Exception as e: 
            db.session.rollback()
            print(f"Unknown error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to upload profile picture. Unknown error"}) 
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
            
            # Read the image file and convert to base64
            with open(full_path, 'rb') as image_file:
                image_data = image_file.read()
                # Determine MIME type based on file extension
                file_ext = client.profile_pic_url.lower().split('.')[-1]
                mime_type = 'image/jpeg' if file_ext in ['jpg', 'jpeg'] else f'image/{file_ext}'
                base64_string = base64.b64encode(image_data).decode('utf-8')
                data_url = f"data:{mime_type};base64,{base64_string}"
            return jsonify({
                "success": 1,
                "exists": 1,
                "image_data": data_url
            }), 200
            
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
            image_dir = os.path.join(image_store, str(client_id))

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
            filename = "profile-" + str(client.id) + ".jpg"
            Client.upload_profile_picture(client.id, image=None, filename=filename, ext="jpg", initial_generation=1)
            return jsonify({"success": 1, "message": "Successfully deleted profile picture for this user"})

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
   