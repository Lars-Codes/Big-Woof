from flask import Blueprint, request, jsonify 
from models.organisms.pet import Pet
from models.logistics.pet_problems import PetProblems
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
    gender = request.form.get("gender")
    fixed = request.form.get("fixed")
    hair_length_id = request.form.get("hair_length_id")
    try: 
        res = Pet.create_pet(client_id, name, age, breed_id, size_id, notes, weight, coat_type_id, gender, fixed, hair_length_id)
        return res 
    except Exception as e:
        print(f"Unexpected error from /createPet: {e}")
        return res
    
@pet_bp.route('/editPetBasicData', methods=['PATCH'])
def editPetBasicData():
    data = {}
    possible_fields = [
        'pet_id', 'name', 'age', 'weight', 'deceased', 'notes', 'size_tier_id', 'breed_id', 'coat_type_id', 'gender', 'fixed', 'hair_length_id', 'typical_groomer_id', 'client_id'
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
        print(f"Unexpected error from /editPetBasicData: {e}")
        return res

@pet_bp.route('/deletePet', methods=["DELETE"])
def deletePet():
    pet_arr = request.get_json().get('petid_arr', [])
    try: 
        res = Pet.delete_pets(pet_arr)
        return res 
    except Exception as e: 
        print(f"Unexpected error from /deletePet: {e}")
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
        print(f"Unexpected error from /changeDeceasedStatus: {e}")
        return res


@pet_bp.route('/addPetProblem', methods=["POST"])
def addPetProblem():
    pet_id = request.form.get('pet_id')
    problem = request.form.get('problem')
    solution = request.form.get('solution')
    try: 
        res = PetProblems.add_pet_problem(pet_id, problem, solution)
        return res
    except Exception as e:
        print(f"Unexpected error from /addPetProblem: {e}")
        return res


@pet_bp.route('/editPetProblem', methods=['PATCH'])
def editPetProblem():
    data = {}
    possible_fields = [
        'pet_problem_id', 'problem', 'solution'
    ]
    
    for field in possible_fields:
        value = request.form.get(field)
        if value is not None:
            data[field] = value
            
    if data.get('pet_problem_id') == None: 
        return (
            jsonify({"success": 0, "error": "Key pet_problem_id must be provided"}), 500, 
        )  
        
    try:
        res = PetProblems.edit_pet_problem(**data)
        return res
    except Exception as e:
        print(f"Unexpected error from /editPetProblem: {e}")
        return res
    

@pet_bp.route('/deletePetProblems', methods=["DELETE"])
def deletePetProblems():
    pet_arr = request.get_json().get('pet_problem_id_arr', [])
    try: 
        res = PetProblems.delete_pet_problems(pet_arr)
        return res 
    except Exception as e: 
        print(f"Unexpected error from /deletePetProblems: {e}")
        return res
    

 
@pet_bp.route('/uploadPetProfilePicture', methods=["POST"])
def uploadProfilePicture():
    try: 
        pet_id = request.form.get("pet_id")
        image = request.files.get("image")
        ext = request.form.get("ext")
            
        if not ext or not image or not pet_id: 
            return (
            jsonify({"success": 0, "error": "Key ext and image and pet_id must be provided"}), 500, 
            ) 
        filename = "pet-profile-" + pet_id + "." + ext
        res = Pet.upload_profile_picture(pet_id, image, filename, ext)
        return res 
    except Exception as e: 
        print(f"Unexpected error from /uploadProfilePicture: {e}")
        return res
    
@pet_bp.route('/getPetProfilePicture', methods=["GET"])
def getProfilePicture():
    try: 
        pet_id = request.args.get("pet_id")
        res = Pet.get_profile_picture(pet_id)
        return res 
    except Exception as e: 
        print(f"Unexpected error from /getPetProfilePicture: {e}")
        return res   
    
@pet_bp.route('/deletePetProfilePicture', methods=["DELETE"])
def deleteProfilePicture():
    try: 
        pet_id = request.form.get("pet_id")
        res = Pet.delete_profile_picture(pet_id)
        return res 
    except Exception as e: 
        print(f"Unexpected error from /deletePetProfilePicture: {e}")
        return res   

@pet_bp.route('/getPetMetadata', methods=["GET"])
def getPetMetadata():
    try: 
        pet_id = request.form.get("pet_id")
        res = Pet.get_pet_metdata(pet_id)
        return res 
    except Exception as e: 
        print(f"Unexpected error from /deletePetProfilePicture: {e}")
        return res   
    