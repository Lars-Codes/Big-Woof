from flask import Blueprint, request, jsonify 
from models.prefilled_tables.payment_types import PaymentTypes
from models.finances.client_payment_types import ClientPaymentTypes

payment_types_bp = Blueprint("payment_types", __name__)

@payment_types_bp.route('/getAllUnassociatedPaymentTypesForClient', methods=["GET"]) # All payment types that are NOT associated with given client 
def getAllPaymentTypesForClient():
    try: 
        client_id = request.form.get('client_id')
        res = ClientPaymentTypes.get_all_unassociated_payment_types(client_id)
        return res  
    except Exception as e:
        print(f"Unexpected error from /getAllPaymentTypes: {e}")
        return res

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

@payment_types_bp.route('/assignPaymentTypeToClient', methods=["POST"])
def assignPaymentTypeToClient():
    try: 
        payment_type_id = request.form.get("payment_type_id")
        client_id = request.form.get("client_id")
        res = ClientPaymentTypes.add_payment_type(client_id=client_id, payment_type_id=payment_type_id)
        return res 
    except Exception as e:
        print(f"Unexpected error from /assignPaymentTypeToClient: {e}")
        return res
    
@payment_types_bp.route('/removePaymentTypeForClient', methods=["DELETE"])
def removePaymentTypeForClient():
    try: 
        payment_type_id = request.form.get("payment_type_id")
        client_id = request.form.get("client_id")
        res = ClientPaymentTypes.removePaymentTypeForClient(client_id, payment_type_id)
        return res 
    except Exception as e:
        print(f"Unexpected error from /removePaymentTypeForClient: {e}")
        return res