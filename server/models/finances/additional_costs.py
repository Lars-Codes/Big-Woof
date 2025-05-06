from models.db import db 
from sqlalchemy.exc import SQLAlchemyError
from flask import jsonify

class AdditionalCosts(db.Model):
    
    __tablename__="additional_costs"
    
    id = db.Column(db.Integer, primary_key = True) 
    client_id = db.Column(db.Integer, db.ForeignKey('clients.id'), nullable=True) 
    pet_id =  db.Column(db.Integer, db.ForeignKey('pets.id'), nullable=True) 
    appointment_id =  db.Column(db.Integer, db.ForeignKey('appointments.id'), nullable=True) 

    added_for_service = db.Column(db.Integer, nullable=False) # boolean -- is this an added cost for mileage or service? 
    added_for_mile = db.Column(db.Integer, nullable=False) # 
    
    # Added cost applies to service or other reason. 
    added_cost = db.Column(db.Numeric(precision=10, scale=2), nullable=True)
    is_percentage = db.Column(db.Integer, nullable=True)
    
    # Add cost for service 
    service_id = db.Column(db.Integer, db.ForeignKey('services.id'), nullable=True) 
    service = db.relationship('Services', backref='additional_costs', lazy='joined')
    
    # Add cost for mile 
    added_cost_per_mile = db.Column(db.Numeric(precision=10, scale=2), nullable=True)
    added_cost_per_mile_is_percent = db.Column(db.Integer, nullable=True)

    reason = db.Column(db.Text)

    
    __table_args__ = (
        db.Index('idx_client_id_added_costs', 'client_id'),
    )
        

    def __init__(self, client_id, pet_id, appointment_id, added_for_service, added_for_mile, added_cost, is_percentage, service, service_id, added_cost_per_mile, added_cost_per_mile_is_percent, reason):
        self.client_id = client_id
        self.pet_id = pet_id
        self.appointment_id = appointment_id
        self.added_for_service = added_for_service
        self.added_for_mile = added_for_mile 
        self.added_cost = added_cost
        self.is_percentage = is_percentage
        self.service_id = service_id
        self.service = service
        self.added_cost_per_mile = added_cost_per_mile
        self.added_cost_per_mile_is_percent = added_cost_per_mile_is_percent
        self.reason = reason 
    
    @classmethod 
    def add_cost_per_client_custom(cls, client_id, added_cost, is_percentage, reason):
        try: 
            add = cls(client_id, None, None, 0, 0, added_cost, is_percentage, None, None, None, None, reason)
            db.session.add(add)
            db.session.commit()
            return jsonify({
                "success": 1, 
                "message": "Extra cost successfully added for client",
                "added_cost_id": add.id
            })
        except SQLAlchemyError as e:
            db.session.rollback()
            print(f"Database error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to add extra cost for client. Database error"}), 500,
            )
        except Exception as e: 
            db.session.rollback()
            print(f"Unknown error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to add extra cost for client. Unknown error"}), 500,
            )  

    @classmethod 
    def add_cost_per_client_per_service(cls, client_id, service_id, added_cost, is_percentage, reason):
        try: 
            add = cls(client_id, None, None, 1, 0, added_cost, is_percentage, None, service_id, None, None, reason)
            db.session.add(add)
            db.session.commit()
            return jsonify({
                "success": 1, 
                "message": "Extra cost successfully added for client",
                "added_cost_id": add.id
            })
        except SQLAlchemyError as e:
            db.session.rollback()
            print(f"Database error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to add extra cost for client. Database error"}), 500,
            )
        except Exception as e: 
            db.session.rollback()
            print(f"Unknown error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to add extra cost for client. Unknown error"}), 500,
            )  

    @classmethod 
    def add_cost_per_client_per_mile(cls, client_id, added_cost_per_mile, added_cost_per_mile_is_percent, reason):
        try: 
            add = cls(client_id, None, None, 0, 1, None, None, None, None, added_cost_per_mile, added_cost_per_mile_is_percent, reason)
            db.session.add(add)
            db.session.commit()
            return jsonify({
                "success": 1, 
                "message": "Extra cost successfully added for client",
                "added_cost_id": add.id
            })
        except SQLAlchemyError as e:
            db.session.rollback()
            print(f"Database error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to add extra cost for client. Database error"}), 500,
            )
        except Exception as e: 
            db.session.rollback()
            print(f"Unknown error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to add extra cost for client. Unknown error"}), 500,
            )  
