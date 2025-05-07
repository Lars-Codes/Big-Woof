from flask import Blueprint, request, jsonify 
from models.prefilled_tables.payment_types import PaymentTypes

payment_types_bp = Blueprint("payment_types", __name__)

@payment_types_bp.route('/getAllPaymentTypes', methods=["GET"])
def getAllPaymentTypes():
    try: 
        res = PaymentTypes.get_all_payment_types()
        return res  
    except Exception as e:
        print(f"Unexpected error from /getAllPaymentTypes: {e}")
        return res
    
@payment_types_bp.route('/createNewPaymentType', methods=["POST"])
def createNewPaymentType():
    try: 
        payment_type = request.form.get('payment_type')
        res = PaymentTypes.create_payment_type(payment_type)
        return res 
    except Exception as e:
        print(f"Unexpected error from /createNewPaymentType: {e}")
        return res
    
@payment_types_bp.route('/deletePaymentType', methods=["DELETE"])
def deletePaymentType():
    try: 
        payment_type_id = request.form.get("payment_type_id")
        res = PaymentTypes.delete_payment_type(payment_type_id)
        return res 
        
    except Exception as e:
        print(f"Unexpected error from /deletePaymentType: {e}")
        return res
    