from models.db import db 
from flask import jsonify
from sqlalchemy.exc import SQLAlchemyError
from models.logistics.services import Services
class ServiceCosts(db.Model):
    
    __tablename__="service_costs"
    
    id = db.Column(db.Integer, primary_key = True) 
    service_id = db.Column(db.Integer, db.ForeignKey('services.id'), nullable=False)  
    service_cost = db.Column(db.Numeric(precision=10, scale=2), nullable=True)

    breed_id = db.Column(db.Integer, db.ForeignKey('breed.id'), nullable=True)  
    size_tier_id = db.Column(db.Integer, db.ForeignKey('size_tier.id'), nullable=True)   
    coat_type_id = db.Column(db.Integer, db.ForeignKey('coat_types.id'), nullable=True)
    hair_length_id = db.Column(db.Integer, db.ForeignKey('hair_length.id'), nullable=True)
    
    breed = db.relationship('Breed', backref='services', lazy='select')
    size_tier = db.relationship('SizeTier', backref='services', lazy='select')
    coat_type = db.relationship('CoatTypes', backref='services', lazy='select')
    hair_length = db.relationship('HairLength', backref='services', lazy='select')

    def __init__(self, service_id, service_cost, breed_id=None, size_tier_id=None, coat_type_id=None, hair_length_id=None):
        self.service_id = service_id
        self.service_cost = service_cost
        self.breed_id = breed_id
        self.size_tier_id = size_tier_id
        self.coat_type_id = coat_type_id
        self.hair_length_id = hair_length_id
        
    @classmethod 
    def add_service_cost(cls, service_id, service_cost, breed_id=None, size_tier_id=None, coat_type_id=None, hair_length_id=None):
        service = Services.query.filter_by(id=service_id).first()
        if not service: 
            return (
                jsonify({"success": 0, "error": "Failed to create service cost. No service associated with specified service id."}), 500,
            )
        new_service_cost = cls(service_id, service_cost, breed_id, size_tier_id, coat_type_id, hair_length_id)
        try: 
            db.session.add(new_service_cost)
            db.session.commit()
            return jsonify({
                "success": 1, 
                "message": "Service cost created succesfully",
                "service_cost_id": new_service_cost.id, 
                "service_id": service_id
            })       
        except SQLAlchemyError as e:
            db.session.rollback()
            print(f"Database error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to create service cost. Database error"}), 500,
            )
        except Exception as e: 
            db.session.rollback()
            print(f"Unknown error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to create service cost. Unknown error"}), 500,
            )  
    
    @classmethod 
    def update_service_cost(cls, **kwargs):
        service_cost_id = kwargs.get('service_cost_id')
        try: 
            service_cost = cls.query.filter_by(id=service_cost_id).first()
            if service_cost:                
                for field in ['service_cost', 'breed_id', 'size_tier_id', 'coat_type_id', 'hair_length_id']:
                    if field in kwargs:
                        setattr(service_cost, field, kwargs[field])

                db.session.commit()
                return jsonify({
                    "success": 1, 
                    "message": "Service cost updated succesfully",
                    "service_cost_id": service_cost_id
                })
            
            else: 
                return jsonify({
                    "success": 0, 
                    "error": "No service cost found for service cost id" 
                }) 
        
        except SQLAlchemyError as e: 
            db.session.rollback()
            print(f"Database error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to update service cost. Database error"}), 500,
            )  
        except Exception as e: 
            db.session.rollback()
            print(f"Unknown error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to update service cost. Unknown error"}), 500, 
            )
            
    @classmethod 
    def delete_service_cost(cls, service_cost_id):
        try: 
            service_cost = ServiceCosts.query.get(service_cost_id)
            if service_cost:
                db.session.delete(service_cost)
                db.session.commit()
                return jsonify({"success": 1, "service_cost_id": service_cost_id, "message": "service cost successfully deleted"})
            else: 
                return jsonify({"success": 0, "error": "No service cost found for specified service cost id"})

        except SQLAlchemyError as e: 
            db.session.rollback()
            print(f"Database error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to delete service cost. Database error"}), 500,
            ) 
        except Exception as e: 
            db.session.rollback()
            print(f"Unknown error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to delete service cost. Unknown error"}), 500, 
            )  