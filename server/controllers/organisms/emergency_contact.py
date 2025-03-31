from flask import Blueprint, request, jsonify 
from models.organisms.emergency_contact import EmergencyContact

emergency_contact_bp = Blueprint("emergency_contact", __name__)

@emergency_contact_bp.route('/createEmergencyContact', methods=['POST'])
def createEmergencyContact():
    print(request.form)
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
    
    print(user_type)
    try: 
        res = None 
        if user_type == 'client':
            res = EmergencyContact.create_emergency_contact(relationship=relationship, fname=fname, lname=lname, primary_phone=primary_phone, email=email, secondary_phone=secondary_phone, street_address=street_address, city=city, state=state, zip=zip, client_id=id)
        # elif user_type == 'employee': 
        #     res = EmergencyContact.create_emergency_contact(relationship=relationship, fname=fname, lname=lname, primary_phone=primary_phone, secondary_phone=secondary_phone, street_address=street_address, city=city, state=state, zip=zip, employee_id=id)

        return res 

    except Exception as e:
        print(f"Unexpected error from /createClient: {e}")
        return res
