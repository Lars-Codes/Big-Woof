from models.db import db 
from models.prefilled_tables.payment_types import PaymentTypes
from flask import jsonify
from sqlalchemy.exc import SQLAlchemyError

class ClientPaymentTypes(db.Model):
    
    __tablename__="client_payment_types"
    
    id = db.Column(db.Integer, primary_key = True) 
    client_id = db.Column(db.Integer, db.ForeignKey('clients.id'), nullable=False) 
    
    payment_type_id = db.Column(db.Integer, db.ForeignKey("payment_types.id"), nullable=False, unique=True)
    payment_type = db.relationship('PaymentTypes', lazy='select')

    __table_args__ = (
        db.Index('idx_client_id_payment', 'client_id'),
    )
        
    def __init__(self, payment_type_id, client_id):
        self.payment_type_id = payment_type_id
        self.client_id = client_id
      
    @classmethod   
    def add_payment_type(cls, client_id, payment_type_id):
        try: 
            payment_type = db.session.query(PaymentTypes).filter_by(id=payment_type_id).first()
            if payment_type: 
                new_payment_type = ClientPaymentTypes(payment_type_id, client_id) 
                db.session.add(new_payment_type)
                db.session.commit()
                return jsonify({
                    "success": 1, 
                    "message": "Payment type assigned to client succesfully",
                    "client_payment_type_id": new_payment_type.id,
                    "payment_type_id": payment_type_id
                })
            else: 
                return jsonify({
                    "success": 0, 
                    "error": "Payment type id specified does not exist",
                })      
            
        except SQLAlchemyError as e: 
            db.session.rollback()
            print(f"Database error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to assign payment type to client. Database error"}), 500,
            )    
        except Exception as e: 
            db.session.rollback()
            print(f"Unknown error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to assign payment type to client. Unknown error"}), 500, 
            ) 
    
    @classmethod
    def removePaymentTypeForClient(cls, client_id, payment_type_id):
        try: 
            payment_type = ClientPaymentTypes.query.filter_by(client_id=client_id, payment_type_id=payment_type_id).first()
            if payment_type: 
                db.session.delete(payment_type)
                db.session.commit()
                return jsonify({"success": 1, "message": "Payment type successfully removed"})
            else: 
                return jsonify({"success": 0, "error": "Payment type for given client_id and payment_type_id not found"})

            
        except SQLAlchemyError as e: 
            db.session.rollback()
            print(f"Database error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to remove payment type for client. Database error"}), 500,
            )    
        except Exception as e: 
            db.session.rollback()
            print(f"Unknown error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to remove payment type for client. Unknown error"}), 500, 
            )    
    
    @classmethod
    def get_all_unassociated_payment_types(cls, client_id):
        try: 
            payment_types_for_client = db.session.query(ClientPaymentTypes).filter(ClientPaymentTypes.client_id == client_id).all()
            associated_payment_type_ids = [payment_type.payment_type_id for payment_type in payment_types_for_client]
            unassociated_payment_types = db.session.query(PaymentTypes).filter(PaymentTypes.id.notin_(associated_payment_type_ids)).all()

            data = []
            # Step 3: Print the results
            for payment_type in unassociated_payment_types:
                payment = {
                    "payment_type": payment_type.payment_type,
                    "payment_type_id": payment_type.id
                }
                data.append(payment) 
                
            return jsonify({
                "success": 1, 
                "data": data, 
            })
                                
        except SQLAlchemyError as e: 
            db.session.rollback()
            print(f"Database error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to get all unassociated payment types for client. Database error"}), 500,
            )    
        except Exception as e: 
            db.session.rollback()
            print(f"Unknown error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to get all unassociated payment types for client. Unknown error"}), 500, 
            ) 