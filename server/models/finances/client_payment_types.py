from models.db import db 
from flask import jsonify

class ClientPaymentTypes(db.Model):
    
    __tablename__="client_payment_types"
    
    id = db.Column(db.Integer, primary_key = True) 
    client_id = db.Column(db.Integer, db.ForeignKey('clients.id'), nullable=False) 
    
    payment_type_id = db.Column(db.Integer, db.ForeignKey("payment_types.id"), nullable=False)
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
            new_payment_type = ClientPaymentTypes(payment_type_id, client_id) 
            db.session.add(new_payment_type)
            db.session.commit()
            return jsonify({
                "success": 1, 
                "message": "Payment type assigned to client succesfully",
                "client_payment_type_id": new_payment_type.id,
                "payment_type_id": payment_type_id
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