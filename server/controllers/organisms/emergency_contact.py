from flask import Blueprint, request, jsonify 
from models.organisms.emergency_contact import EmergencyContact

emergency_contact_bp = Blueprint("emergency_contact", __name__)

@emergency_contact_bp.route('/createEmergencyContact', methods=['POST'])
def createEmergencyContact():
    relationship = request.form.get('relationship', None)
    fname = request.form.get('fname')
    lname = request.form.get('lname')
    user_type = request.form.get('user_type')
    id = request.form.get('id', 0)
    
    primary_phone = request.form.get('primary_phone')
    secondary_phone = request.form.get('secondary_phone', None)
    email = request.form.get('email', None)
    street_address = request.form.get("street_address", None)
    city = request.form.get('city', None)
    state = request.form.get('state', None)
    zip = request.form.get('zip', None)
    
    try: 
        res = EmergencyContact.create_emergency_contact(user_type=user_type, relationship=relationship, fname=fname, lname=lname, primary_phone=primary_phone, email=email, secondary_phone=secondary_phone, street_address=street_address, city=city, state=state, zip=zip, id=id)
        return res 

    except Exception as e:
        print(f"Unexpected error from /createEmergencyContact: {e}")
        return res

@emergency_contact_bp.route('/editEmergencyContact', methods=['PATCH'])
def editEmergencyContact():
    # USER TYPE IS REQUIRED AS "client" or "employee"
    data = {}
    possible_fields = [
        'emergency_contact_id', 'user_type', 'relationship', 'fname', 'lname',
        'primary_phone', 'secondary_phone', 'email', 'street_address', 'city', 'state', 'zip', 'id'
    ]
    
    for field in possible_fields:
        value = request.form.get(field)
        if value is not None:
            data[field] = value
            
    if data.get('user_type') == None: 
        return (
            jsonify({"success": 0, "error": "Key user_type must be provided (client or employee)"}), 500, 
        )  
        
    try:
        res = EmergencyContact.edit_emergency_contact(**data)

        return res

    except Exception as e:
        print(f"Unexpected error from /editEmergencyContact: {e}")
        return res
    
@emergency_contact_bp.route('/deleteEmergencyContact', methods=['DELETE'])
def deleteEmergencyContact():
    try: 
        id = request.form.get('id', 0)
        user_type = request.form.get('user_type')
        emergency_contact_id = request.form.get('emergency_contact_id')
        
        res = EmergencyContact.delete_emergency_contact(user_type, id, emergency_contact_id)
        return res 
    except Exception as e: 
        print(f"Unexpected error from /deleteEmergencyContact: {e}")
        return res
    
