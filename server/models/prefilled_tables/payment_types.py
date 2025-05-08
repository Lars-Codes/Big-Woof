from models.db import db 
from sqlalchemy.exc import SQLAlchemyError

from flask import jsonify

class PaymentTypes(db.Model): 
    
    __tablename__="payment_types"
    
    id = db.Column(db.Integer, primary_key = True) 
    payment_type = db.Column(db.String(20), nullable = False)
    
    __table_args__ = (
        db.Index('idx_payment_type_id', 'id'),
    )
    
    
    def __init__(self, payment_type):
        self.payment_type = payment_type
        
    @classmethod 
    def populate_prefilled_values(cls):
        if db.session.query(cls).first():
            print("Payment types already populated. Skipping.")
            return
        else: 
            cash = PaymentTypes("cash")
            credit = PaymentTypes("credit")
            debit = PaymentTypes("debit")
            venmo = PaymentTypes("venmo")
            paypal = PaymentTypes("paypal")
            zelle = PaymentTypes("zelle")
            
            try: 
                db.session.add(cash)
                db.session.add(credit)
                db.session.add(debit)
                db.session.add(venmo)
                db.session.add(paypal)
                db.session.add(zelle)
                db.session.commit()
                print("Prefilled values for payment types.")
            except SQLAlchemyError as e:
                db.session.rollback()
                print(f"Error inserting prefilled payment types on app start: {e}")
            except Exception as e: 
                db.session.rollback()
                print(f"Error inserting prefilled payment types on app start:: {e}")
        
    @classmethod 
    def create_payment_type(cls, payment_type): 
        try: 
            new_payment_type = PaymentTypes(payment_type) 
            db.session.add(new_payment_type)
            db.session.commit()
            return jsonify({
                "success": 1, 
                "message": "Payment type created succesfully",
                "payment_type_id": new_payment_type.id,
                "payment_type": new_payment_type.payment_type
            })
        except SQLAlchemyError as e: 
            db.session.rollback()
            print(f"Database error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to create payment type. Database error"}), 500,
            )    
        except Exception as e: 
            db.session.rollback()
            print(f"Unknown error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to create payment type. Unknown error"}), 500, 
            )   
        
    
    @classmethod 
    def get_all_payment_types(cls): 
        try: 
            query = db.session.query(PaymentTypes)
            # query = db.session.query(PaymentTypes)
            payment_data = [
                {
                    "payment_type_id": payment_type.id, 
                    "payment_type": payment_type.payment_type
                }
                for payment_type in query  
            ] 
            return jsonify({
                "success": 1, 
                "data": payment_data, 
            }) 

        except SQLAlchemyError as e: 
            db.session.rollback()
            print(f"Database error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to get all payment types. Database error"}), 500,
            )    
        except Exception as e: 
            db.session.rollback()
            print(f"Unknown error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to get all payment types. Unknown error"}), 500, 
            )    

    @classmethod 
    def get_payment_types_for_client(cls, client_id):
        pass 

    @classmethod 
    def update_payment_type(cls, payment_type_id, updated_name): 
        pass 
    
    @classmethod 
    def delete_payment_type(cls, payment_type_id): 
        try:
            payment_type = PaymentTypes.query.get(payment_type_id)
            if payment_type:
                db.session.delete(payment_type)
                db.session.commit()
                return jsonify({
                "success": 1, 
                "message": "Payment type deleted succesfully",
                })
            else: 
                return jsonify({
                "success": 0, 
                "error": "No payment type associated with specified id",
                })

            
        except SQLAlchemyError as e: 
            db.session.rollback()
            print(f"Database error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to delete payment type. Database error"}), 500,
            )    
        except Exception as e: 
            db.session.rollback()
            print(f"Unknown error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to delete payment type. Unknown error"}), 500, 
            )    
 