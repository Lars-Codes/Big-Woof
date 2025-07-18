from models.db import db 
from models.finances.appointment_fees import AppointmentFees
from models.logistics.service_additions import ServiceAdditions
from flask import jsonify
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import joinedload

# Services can be added by breed, hair length, coat type, size tier 
class Services(db.Model):
    
    __tablename__="services"
    
    id = db.Column(db.Integer, primary_key = True) 
    service_name = db.Column(db.String(300), nullable=False)
    service_costs = db.relationship('ServiceCosts', uselist=True, backref='services', cascade="all, delete", single_parent=True, lazy='select', foreign_keys='ServiceCosts.service_id')
    service_additions = db.relationship('ServiceAdditions', uselist=True, backref='services', cascade="all, delete", single_parent=True, lazy='select', foreign_keys='ServiceAdditions.service_id')
    description = db.Column(db.Text, nullable = True) 


    def __init__(self, service_name, description):
        self.service_name = service_name 
        self.description = description
        
    @classmethod 
    def get_all_services(cls):
        try: 
            services = Services.query.options(
                joinedload(Services.service_costs), 
                joinedload(Services.service_additions), 
            ).all()
            
            appointment_fees = db.session.query(AppointmentFees).all()
            
            outside_of_service_add_ons = db.session.query(ServiceAdditions).filter(ServiceAdditions.service_id == None).all()
            
            service_data = []
            for service in services: 
                data = {
                    "service_name": service.service_name, 
                    "description": service.description if service.description else "",
                    "service_costs": [],
                    "service_additions": [],
                }
                
                for cost in service.service_costs: 
                    cost_info = {
                        "service_cost": cost.service_cost, 
                        "breed": cost.breed.name if cost.breed else "",
                        "size_tier": cost.size_tier.size_tier if cost.size_tier else "",
                        "coat_type": cost.coat_type.coat_type if cost.coat_type else "",
                        "hair_length": cost.hair_length.length if cost.hair_length else "",
                    }
                    data["service_costs"].append(cost_info)
                
                for addition in service.service_additions: 
                    addition_info = {
                        "service_addition_added_cost": addition.added_cost, 
                        "reason": addition.reason, 
                        "description": addition.description if addition.description else "",
                    }
                    data["service_additions"].append(addition_info)
                
                service_data.append(data)  
                
            fees_data = [
                {
                    "fee_id": fee.id, 
                    "reason": fee.reason, 
                    "fee": fee.fee
                }
                for fee in appointment_fees
            ]
            
            outside_service = [
                {
                    "service_addition_added_cost": addition.added_cost, 
                    "reason": addition.reason, 
                    "description": addition.description if addition.description else "",
                }
                for addition in outside_of_service_add_ons
            ]
                    
            return jsonify({
                "success": 1, 
                "data": {
                    "services": service_data,
                    "appointment_fees": fees_data,
                    "standalone_additions": outside_service
                }
            })  
        except SQLAlchemyError as e:
            db.session.rollback()
            print(f"Database error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to get all services. Database error"}), 500,
            )
        except Exception as e: 
            db.session.rollback()
            print(f"Unknown error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to get all services. Unknown error"}), 500,
            ) 
        
    @classmethod 
    def create_service(cls, service_name, description):
        new_service = cls(service_name, description)
        try: 
            db.session.add(new_service)
            db.session.commit()
            return jsonify({
                "success": 1, 
                "message": "Service created succesfully",
                "service_id": new_service.id
            })       
        except SQLAlchemyError as e:
            db.session.rollback()
            print(f"Database error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to create service. Database error"}), 500,
            )
        except Exception as e: 
            db.session.rollback()
            print(f"Unknown error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to create service. Unknown error"}), 500,
            )  
    
    @classmethod 
    def update_service(cls, **kwargs):
        service_id = kwargs.get('service_id')
        try: 
            service = cls.query.filter_by(id=service_id).first()
            if service:                
                for field in ['service_name', 'description']:
                    if field in kwargs:
                        setattr(service, field, kwargs[field])

                db.session.commit()
                return jsonify({
                    "success": 1, 
                    "message": "Service updated succesfully",
                    "service_id": service_id
                })
            
            else: 
                return jsonify({
                    "success": 0, 
                    "error": "No service found for service id" 
                }) 
        
        except SQLAlchemyError as e: 
            db.session.rollback()
            print(f"Database error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to update service data. Database error"}), 500,
            )  
        except Exception as e: 
            db.session.rollback()
            print(f"Unknown error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to update service data. Unknown error"}), 500, 
            )
        
    @classmethod     
    def delete_service(cls, service_id):
        try: 
            service = Services.query.get(service_id)
            if service:
                db.session.delete(service)
                db.session.commit()
                return jsonify({"success": 1, "service_id": service_id, "message": "service successfully deleted"})
            else: 
                return jsonify({"success": 0, "error": "No service found for specified service id"})

        except SQLAlchemyError as e: 
            db.session.rollback()
            print(f"Database error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to delete service. Database error"}), 500,
            ) 
        except Exception as e: 
            db.session.rollback()
            print(f"Unknown error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to delete service. Unknown error"}), 500, 
            )  