from models.db import db 
from sqlalchemy.exc import SQLAlchemyError

class PaymentTypes(db.Model): 
    
    __tablename__="payment_types"
    
    id = db.Column(db.Integer, primary_key = True) 
    payment_type = db.Column(db.String(20), nullable = False)
    
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
        pass 
    
    @classmethod 
    def get_all_payment_types(cls): 
        # Get all configured payment types
        pass 

    @classmethod 
    def get_payment_types_for_client(cls, client_id):
        pass 

    @classmethod 
    def update_payment_type(cls, payment_type_id, updated_name): 
        pass 
    
    @classmethod 
    def delete_payment_type(cls, payment_type_id): 
        pass 