from models.db import db 
from sqlalchemy.exc import SQLAlchemyError
from flask import jsonify

class ServiceAdditions(db.Model):
    
    id = db.Column(db.Integer, primary_key = True) 
    service_id = db.Column(db.Integer, db.ForeignKey('services.id'), nullable=True)  
    
    added_cost = db.Column(db.Numeric(precision=10, scale=2), nullable=False)
    reason = db.Column(db.String(300), nullable=False)
    description = db.Column(db.Text, nullable = True) 
    
    def __init__(self, service_id, added_cost, reason, description):
        self.service_id = service_id
        self.added_cost = added_cost
        self.reason = reason
        self.description = description
        
    
    @classmethod 
    def create_addition(cls, service_id, added_cost, reason, description):
        new_service = cls(service_id, added_cost, reason, description)
        try: 
            db.session.add(new_service)
            db.session.commit()
            return jsonify({
                "success": 1, 
                "message": "Service addition created succesfully",
                "service_addition_id": new_service.id
            })       
        except SQLAlchemyError as e:
            db.session.rollback()
            print(f"Database error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to create service addition. Database error"}), 500,
            )
        except Exception as e: 
            db.session.rollback()
            print(f"Unknown error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to create service addition. Unknown error"}), 500,
            )   
        
 
    @classmethod 
    def update_addition(cls, **kwargs):
        service_addition_id = kwargs.get('service_addition_id')
        try: 
            addition = cls.query.filter_by(id=service_addition_id).first()
            if addition:                
                for field in ["added_cost", "reason", "description"]:
                    if field in kwargs:
                        setattr(addition, field, kwargs[field])

                db.session.commit()
                return jsonify({
                    "success": 1, 
                    "message": "Service updated succesfully",
                    "service_addition_id": service_addition_id
                })
            
            else: 
                return jsonify({
                    "success": 0, 
                    "error": "No service addition found for service addition id" 
                }) 
        
        except SQLAlchemyError as e: 
            db.session.rollback()
            print(f"Database error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to update service addition data. Database error"}), 500,
            )  
        except Exception as e: 
            db.session.rollback()
            print(f"Unknown error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to update service addition data. Unknown error"}), 500, 
            )
            
    @classmethod     
    def delete_addition(cls, addition_id):
        try: 
            addition = ServiceAdditions.query.get(addition_id)
            if addition:
                db.session.delete(addition)
                db.session.commit()
                return jsonify({"success": 1, "service_addition_id": addition_id, "message": "service addition successfully deleted"})
            else: 
                return jsonify({"success": 0, "error": "No service addition found for specified service id"})

        except SQLAlchemyError as e: 
            db.session.rollback()
            print(f"Database error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to delete service addition. Database error"}), 500,
            ) 
        except Exception as e: 
            db.session.rollback()
            print(f"Unknown error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to delete service addition. Unknown error"}), 500, 
            )  