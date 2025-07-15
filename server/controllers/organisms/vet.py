from flask import Blueprint, request, jsonify 
from models.organisms.vet import Vet 

vet_bp = Blueprint("vet", __name__)


@vet_bp.route('/createVet', methods=["POST"])
def createVet():
    client_id = request.form.get('client_id')
    fname = request.form.get('fname')
    lname = request.form.get('lname')
    primary_phone = request.form.get('primary_phone')
    email = request.form.get("email", None)
    street_address = request.form.get("street_address", None)
    city = request.form.get("city", None)
    state = request.form.get("state", None)
    zip = request.form.get("zip", None)
    secondary_phone = request.form.get("secondary_phone", None)
    notes = request.form.get("notes", None)

    try: 
        res = Vet.create_vet(client_id, fname, lname, notes, primary_phone, secondary_phone, email, street_address, city, state, zip)
        return res 
    except Exception as e:
        print(f"Unexpected error from /createVet: {e}")
        return res
    
    
@vet_bp.route('/updateVetContact', methods=["PATCH"])
def updateVetContact():
    data = {}
    possible_fields = [
        'client_id', 'vet_id', 'fname', 'lname', 'city', 'email', 'notes', 
        'primary_phone', 'secondary_phone', 'state', 'street_address', 'zip'
    ]
    
    for field in possible_fields:
        value = request.form.get(field)
        if value is not None:
            data[field] = value
            
    if data.get('client_id') == None: 
        return (
            jsonify({"success": 0, "error": "Key client_id must be provided"}), 500, 
        )
        
    if data.get('vet_id') == None: 
        return (
            jsonify({"success": 0, "error": "Key vet_id must be provided"}), 500, 
        )  
        
    try:
        res = Vet.update_vet_contact(**data)
        return res
    except Exception as e:
        print(f"Unexpected error from /updateVetContact: {e}")
        return res

@vet_bp.route('/deleteVet', methods=["DELETE"])
def deleteVet():
    try:
        data = request.get_json()
        
        client_id = data.get('client_id')
        vet_id = data.get('vet_id')
        res = Vet.delete_vet(client_id, vet_id)
        return res
    except Exception as e:
        print(f"Unexpected error from /deleteVet: {e}")
        return res

