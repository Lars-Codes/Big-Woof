from flask import Blueprint, request, jsonify 
from models.organisms.client import Client 

client_bp = Blueprint("clients", __name__)

@client_bp.route('/getAllClients', methods=["GET"])
def getAllClients():    
    try: 
        res = Client.get_all_clients()
        return res
    
    except Exception as e:
        print(f"Unexpected error from /getAllClients: {e}")
        return res
    
@client_bp.route('/createClient', methods=["POST"])
def createClient():

    fname = request.form.get('fname')
    lname = request.form.get('lname')
    phone_number = request.form.get('phone_number')
    email = request.form.get("email", None)
    street_address = request.form.get("street_address", None)
    city = request.form.get("city", None)
    state = request.form.get("state", None)
    zip = request.form.get("zip", None)
    secondary_phone = request.form.get("secondary_phone", None)
    notes = request.form.get("notes", None)
    favorite = int(request.form.get("favorite", 0))  # Default to 0 if 'favorite' is not provided
    try: 
        res = Client.create_client(fname, lname, phone_number, email, street_address, city, state, zip, secondary_phone, notes, favorite)
        return res 
    except Exception as e:
        print(f"Unexpected error from /createClient: {e}")
        return res
    

@client_bp.route('/deleteClient', methods=["DELETE"])
def deleteClients():
    client_arr = request.get_json().get('clientid_arr', [])
    print(client_arr)
    try: 
        res = Client.delete_clients(client_arr)
        return res 
    except Exception as e: 
        print(f"Unexpected error from /deleteClient: {e}")
        return res
    
@client_bp.route('/uploadProfilePicture', methods=["POST"])
def uploadProfilePicture():
    try: 
        client_id = request.form.get("client_id")
        image = request.files.get("image")
        ext = request.form.get("ext")
        
        if not ext or not image or not client_id: 
            return (
            jsonify({"success": 0, "error": "Key ext and image and client_id must be provided"}), 500, 
            ) 
        filename = "profile-" + client_id + "." + ext
        res = Client.upload_profile_picture(client_id, image, filename, ext)
        return res 
    except Exception as e: 
        print(f"Unexpected error from /uploadProfilePicture: {e}")
        return res
    
@client_bp.route('/getProfilePicture', methods=["GET"])
def getProfilePicture():
    try: 
        client_id = request.args.get("client_id")
        res = Client.get_profile_picture(client_id)
        return res 
    except Exception as e: 
        print(f"Unexpected error from /getProfilePicture: {e}")
        return res   
    
@client_bp.route('/deleteProfilePicture', methods=["DELETE"])
def deleteProfilePicture():
    try: 
        client_id = request.form.get("client_id")
        res = Client.delete_profile_picture(client_id)
        return res 
    except Exception as e: 
        print(f"Unexpected error from /deleteProfilePicture: {e}")
        return res   
    
@client_bp.route('/getClientMetadata', methods=['GET'])
def getClientMetadata():
    try: 
        client_id = request.args.get("client_id")
        res = Client.get_client_metadata(client_id)
        return res 
    except Exception as e: 
        print(f"Unexpected error from /getClientMetadata: {e}")
        return res
        
    
@client_bp.route('/getCostAndTimeStatsMetadata', methods=['GET'])
def getCostAndTimeStatsMetadata():
    try: 
        client_id = request.form.get("client_id")
        res = Client.get_cost_and_time_stats_metadata(client_id)
        return res 
    except Exception as e: 
        print(f"Unexpected error from /getClientDocumentsMetadata: {e}")
        return res

@client_bp.route('/getClientDocumentsMetadata', methods=['GET'])
def getClientDocumentMetadata():
    try: 
        client_id = request.form.get("client_id")
        res = Client.get_client_document_metadata(client_id)
        return res 
    except Exception as e: 
        print(f"Unexpected error from /getClientDocumentsMetadata: {e}")
        return res
    
@client_bp.route('/getAppointmentMetadata', methods=['GET'])
def getAppointmentMetadata():
    try: 
        client_id = request.form.get("client_id")
        res = Client.get_appointment_metadata(client_id)
        return res
    except Exception as e: 
        print(f"Unexpected error from /getAppointmentMetadata: {e}")
        return res

@client_bp.route('/editClientContact', methods=['PATCH'])
def editClientContact():
    # USER TYPE IS REQUIRED AS "client" or "employee"
    data = {}
    possible_fields = [
        'client_id', 'primary_phone', 'secondary_phone', 'email', 'street_address', 'city', 'state', 'zip'
    ]
    
    for field in possible_fields:
        value = request.form.get(field)
        if value is not None:
            data[field] = value
            
    if data.get('client_id') == None: 
        return (
            jsonify({"success": 0, "error": "Key client_id must be provided"}), 500, 
        )  
        
    try:
        res = Client.edit_client_contact(**data)
        return res
    except Exception as e:
        print(f"Unexpected error from /editClientContact: {e}")
        return res

@client_bp.route('/editClientBasicData', methods=['PATCH'])
def editClientBasicData():
    # USER TYPE IS REQUIRED AS "client" or "employee"
    data = {}
    possible_fields = [
        'client_id', 'fname', 'lname', 'notes'
    ]
    
    for field in possible_fields:
        value = request.form.get(field)
        if value is not None:
            data[field] = value
            
    if data.get('client_id') == None: 
        return (
            jsonify({"success": 0, "error": "Key client_id must be provided"}), 500, 
        )  
        
    try:
        res = Client.edit_client_basic_data(**data)
        return res
    except Exception as e:
        print(f"Unexpected error from /editClientBasicData: {e}")
        return res

@client_bp.route('/updateClientIsFavorite', methods=['PATCH'])
def updateClientIsFavorite():
    try:
        client_id = request.form.get("client_id")
        favorite = request.form.get("favorite")
        
        res = Client.update_client_is_favorite(client_id, favorite)
        return res
    except Exception as e:
        print(f"Unexpected error from /addClientToFavorites: {e}")
        return res
    