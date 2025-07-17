from models.db import db 
from flask import jsonify
from sqlalchemy.exc import SQLAlchemyError

class AppointmentFees(db.Model):
    
    id = db.Column(db.Integer, primary_key = True) 
    fee = db.Column(db.Numeric(precision=10, scale=2), nullable=False)
    reason = db.Column(db.String(300), nullable=False)
    
    def __init__(self, fee, reason):
        self.fee = fee 
        self.reason = reason  
    

    @classmethod 
    def populate_prefilled_values(cls):
        if db.session.query(cls).first():
            print("Appointment fees already populated. Skipping.")
            return
        else: 
            late_fee = AppointmentFees(0.00, "Late")
            no_show_fee = AppointmentFees(0.00, "No-show")
            cancellation = AppointmentFees(0.00, "Cancellation")
            late_cancellation = AppointmentFees(0.00, "Late cancellation")
            cost_per_mile = AppointmentFees(0.00, "Price per mile")
            try: 
                db.session.add(late_fee)
                db.session.add(no_show_fee)
                db.session.add(cancellation)
                db.session.add(late_cancellation)
                db.session.add()
                db.session.commit(cost_per_mile)
                print("Prefilled values for appointment fees.")
            except SQLAlchemyError as e:
                db.session.rollback()
                print(f"Error inserting prefilled appointment fees on app start: {e}")
            except Exception as e: 
                db.session.rollback()
                print(f"Error inserting prefilled appointment fees on app start:: {e}")

    @classmethod 
    def create_fee(cls, fee, reason):
        if not fee or not reason: 
            return (
                jsonify({"success": 0, "error": "Failed to create fee. Must include a fee and a reason."}), 500,
            )
        new_fee = cls(float(fee), reason)
        try: 
            db.session.add(new_fee)
            db.session.commit()
            return jsonify({
                "success": 1, 
                "message": "Fee created succesfully",
                "fee_id": new_fee.id
            })       
        except SQLAlchemyError as e:
            db.session.rollback()
            print(f"Database error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to create fee. Database error"}), 500,
            )
        except Exception as e: 
            db.session.rollback()
            print(f"Unknown error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to create fee. Unknown error"}), 500,
            )  
    
    @classmethod 
    def update_fee(cls, **kwargs):
        fee_id = kwargs.get('fee_id')
        
        if fee_id!='': 
            fee_id_int = int(fee_id)
        else: 
            return (
                    jsonify({"success": 0, "error": "Fee id must be an integer."}), 500,
                )  
        if fee_id_int >=1 and fee_id_int <= 5: 
            if 'reason' in kwargs: 
                return (
                    jsonify({"success": 0, "error": "Not allowed to update reason fields for pre-filled indices 1-5."}), 500,
                )  
        
        try: 
            fee = cls.query.filter_by(id=fee_id).first()
            if fee:                
                for field in ['fee', 'reason']:
                    if field in kwargs:
                        setattr(fee, field, kwargs[field])

                db.session.commit()
                return jsonify({
                    "success": 1, 
                    "message": "Fee updated succesfully",
                    "fee_id": fee_id
                })
            
            else: 
                return jsonify({
                    "success": 0, 
                    "error": "No fee found for fee id" 
                }) 
        
        except SQLAlchemyError as e: 
            db.session.rollback()
            print(f"Database error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to update fee data. Database error"}), 500,
            )  
        except Exception as e: 
            db.session.rollback()
            print(f"Unknown error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to update fee data. Unknown error"}), 500, 
            )
        
    @classmethod     
    def delete_fee(cls, fee_id):
        try:
            if fee_id!='': 
                fee_id_int = int(fee_id)
            else: 
                return (
                        jsonify({"success": 0, "error": "Fee id must be an integer."}), 500,
                    )  
            if fee_id_int >=1 and fee_id_int <= 5: 
                return (
                    jsonify({"success": 0, "error": "Not allowed to delete pre-filled indices 1-5."}), 500,
                )  
            
            fee = AppointmentFees.query.get(fee_id)
            if fee:
                db.session.delete(fee)
                db.session.commit()
                return jsonify({"success": 1, "fee_id": fee_id, "message": "fee successfully deleted"})
            else: 
                return jsonify({"success": 0, "error": "No fee found for specified fee id"})

        except SQLAlchemyError as e: 
            db.session.rollback()
            print(f"Database error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to delete fee. Database error"}), 500,
            ) 
        except Exception as e: 
            db.session.rollback()
            print(f"Unknown error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to delete fee. Unknown error"}), 500, 
            )  