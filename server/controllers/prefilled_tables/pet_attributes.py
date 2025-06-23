from flask import Blueprint, request, jsonify 
from models.prefilled_tables.hair_length import HairLength
from models.prefilled_tables.breed import Breed
from models.prefilled_tables.coat_types import CoatTypes
from models.prefilled_tables.size_tier import SizeTier


pet_attributes_bp = Blueprint("pet_attributes", __name__)

# HAIR LENGTH CRUD =================================
@pet_attributes_bp.route('/createHairLength', methods=["POST"])
def createHairLength():
    hair_length = request.form.get('hair_length')
    try: 
        res = HairLength.create_new_hair_length(hair_length)
        return res 
    except Exception as e:
        print(f"Unexpected error from /createHairLength: {e}")
        return res
    
@pet_attributes_bp.route('/deleteHairLength', methods=["DELETE"])
def deleteHairLength():
    hair_length_id = request.form.get('hair_length_id')
    try: 
        res = HairLength.delete_hair_length(hair_length_id)
        return res 
    except Exception as e:
        print(f"Unexpected error from /deleteHairLength: {e}")
        return res

@pet_attributes_bp.route('/getHairLengths', methods=["GET"])
def getHairLengths():
    try: 
        res = HairLength.get_hair_lengths()
        return res 
    except Exception as e:
        print(f"Unexpected error from /getHairLengths: {e}")
        return res
   
# SIZE TIER CRUD =========================================================   
@pet_attributes_bp.route('/createSizeTier', methods=["POST"])
def createSizeTier():
    size_tier = request.form.get('size_tier')
    try: 
        res = SizeTier.create_new_size_tier(size_tier)
        return res 
    except Exception as e:
        print(f"Unexpected error from /createSizeTier: {e}")
        return res
    
@pet_attributes_bp.route('/deleteSizeTier', methods=["DELETE"])
def deleteSizeTier():
    size_tier_id = request.form.get('size_tier_id')
    try: 
        res = SizeTier.delete_size_tier(size_tier_id)
        return res 
    except Exception as e:
        print(f"Unexpected error from /deleteSizeTier: {e}")
        return res

@pet_attributes_bp.route('/getSizeTiers', methods=["GET"])
def getSizeTiers():
    try: 
        res = SizeTier.get_size_tiers()
        return res 
    except Exception as e:
        print(f"Unexpected error from /getSizeTiers: {e}")
        return res
    

# COAT TYPE CRUD =========================================================   
@pet_attributes_bp.route('/createCoatType', methods=["POST"])
def createCoatType():
    coat_type = request.form.get('coat_type')
    try: 
        res = CoatTypes.create_new_coat_type(coat_type)
        return res 
    except Exception as e:
        print(f"Unexpected error from /createCoatType: {e}")
        return res
    
@pet_attributes_bp.route('/deleteCoatType', methods=["DELETE"])
def deleteCoatType():
    coat_type_id = request.form.get('coat_type_id')
    try: 
        res = CoatTypes.delete_coat_type(coat_type_id)
        return res 
    except Exception as e:
        print(f"Unexpected error from /deleteCoatType: {e}")
        return res

@pet_attributes_bp.route('/getCoatTypes', methods=["GET"])
def getCoatTypes():
    try: 
        res = CoatTypes.get_coat_types()
        return res 
    except Exception as e:
        print(f"Unexpected error from /getCoatTypes: {e}")
        return res
    

# BREED CRUD =========================================================   
@pet_attributes_bp.route('/createBreed', methods=["POST"])
def createBreed():
    breed = request.form.get('breed')
    try: 
        res = Breed.create_breed(breed)
        return res 
    except Exception as e:
        print(f"Unexpected error from /createBreed: {e}")
        return res
    
@pet_attributes_bp.route('/deleteBreed', methods=["DELETE"])
def deleteBreed():
    breed_id = request.form.get('breed_id')
    try: 
        res = Breed.delete_breed(breed_id)
        return res 
    except Exception as e:
        print(f"Unexpected error from /deleteBreed: {e}")
        return res

@pet_attributes_bp.route('/getBreeds', methods=["GET"])
def getBreeds():
    try: 
        res = Breed.get_breeds()
        return res 
    except Exception as e:
        print(f"Unexpected error from /getBreeds: {e}")
        return res