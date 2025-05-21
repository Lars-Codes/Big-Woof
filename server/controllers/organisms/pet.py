from flask import Blueprint, request, jsonify 
from models.organisms.pet import Pet

pet_bp = Blueprint("pets", __name__)

@pet_bp.route('/createPet', methods=["POST"])
def createPet():

    client_id = request.form.get('client_id')
    name = request.form.get("name")
    age = request.form.get("age")
    weight = request.form.get("weight")
    notes = request.form.get("notes")
    
    breed_id = request.form.get("breed_id")
    size_id = request.form.get("size_tier_id")
    coat_type_id = request.form.get("coat_type_id")
    try: 
        res = Pet.create_pet(client_id, name, age, breed_id, size_id, notes, weight, coat_type_id)
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
    

@pet_bp.route('/getAllPets', methods=["GET"])
def getAllPets():
    print(Pet.get_all_pets)  # Should show it's a bound method to the class

    # page = request.args.get('page', default=1, type=int)
    page = request.args.get('page', default=1, type=int)
    page_size = request.args.get('page_size', default=10, type=int)
    searchbar_chars = request.args.get('searchbar_chars', default="", type=str)
    
    try: 
        res = Pet.get_all_pets(page, page_size, searchbar_chars)
        return res
    
    except Exception as e:
        print(f"Unexpected error from /getAllPets: {e}")
        return res

@pet_bp.route('/changeDeceasedStatus', methods=["POST"])
def changeDeceasedStatus():
    pet_id = request.form.get('pet_id')
    deceased = request.form.get('deceased')

    try: 
        res = Pet.change_deceased_status(pet_id, deceased)
        return res
    except Exception as e:
        print(f"Unexpected error from /getAllPets: {e}")
        return res
