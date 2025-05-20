from flask import Blueprint, request, jsonify 
from models.organisms.pet import Pet

pet_bp = Blueprint("pets", __name__)

@pet_bp.route('/createPet', methods=["POST"])
def createClient():

    client_id = request.form.get('client_id')
    name = request.form.get("name")
    age = request.form.get("age")
    weight = request.form.get("weight")
    deceased = request.form.get("deceased")
    notes = request.form.get("notes")
    
    breed_id = request.form.get("breed_id")
    size_id = request.form.get("size_tier_id")
    
    
    try: 
        # res = Client.create_client(fname, lname, phone_number, email, street_address, city, state, zip, secondary_phone, notes, favorite)
        return res 
    except Exception as e:
        print(f"Unexpected error from /createClient: {e}")
        return res