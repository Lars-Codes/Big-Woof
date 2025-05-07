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