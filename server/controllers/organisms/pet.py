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
    coat_type_id = request.form.get("coat_type_id")
    try: 
        res = Pet.create_pet(client_id, name, age, breed_id, size_id, notes, weight, deceased, coat_type_id)
        return res 
    except Exception as e:
        print(f"Unexpected error from /createClient: {e}")
        return res
    
@pet_bp.route('/editPetBasicData', methods=['PATCH'])
def editPetBasicData():
    data = {}
    possible_fields = [
        'pet_id', 'name', 'age', 'weight', 'deceased', 'notes', 'size_tier_id', 'breed_id', 'coat_type_id'
    ]
    
    for field in possible_fields:
        value = request.form.get(field)
        if value is not None:
            data[field] = value
            
    if data.get('pet_id') == None: 
        return (
            jsonify({"success": 0, "error": "Key pet_id must be provided"}), 500, 
        )  
        
    try:
        res = Pet.edit_pet_basic_data(**data)
        return res
    except Exception as e:
        print(f"Unexpected error from /editClientBasicData: {e}")
        return res

@pet_bp.route('/deletePet', methods=["DELETE"])
def deleteClients():
    pet_arr = request.get_json().get('petid_arr', [])
    try: 
        res = Pet.delete_pets(pet_arr)
        return res 
    except Exception as e: 
        print(f"Unexpected error from /deleteClient: {e}")
        return res