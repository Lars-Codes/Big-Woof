from flask import Blueprint, request, jsonify 
from models.misc.images import PetImages

pet_images_bp = Blueprint("pet_images_bp", __name__)


@pet_images_bp.route('/uploadPetImage', methods=["POST"])
def uploadPetImage():
    client_id = request.form.get("client_id")
    pet_id = request.form.get("pet_id")
    image = request.files.get("image")
    caption = request.form.get("caption")
    comparison = request.form.get("comparison")
    
    if int(comparison)!=1 and int(comparison)!=0: 
        return jsonify({
            "success": 0,
            "error": "Comparison must be a bool 0 or 1"
        })
    
    try: 
        res = PetImages.upload_pet_image(client_id, pet_id, image, caption, comparison)
        return res 
    except Exception as e: 
        print(f"Unexpected error from /uploadPetImage: {e}")
        return res