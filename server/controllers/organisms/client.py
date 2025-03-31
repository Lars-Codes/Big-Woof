from flask import Blueprint, request, jsonify 
from models.organisms.client import Client 

client_bp = Blueprint("clients", __name__)

@client_bp.route('/getAllClients', methods=["GET"])
def getAllClients():
    # page = request.args.get('page', default=1, type=int)
    page = request.form.get('page', 1)
    page_size = request.form.get('page_size', 10)
    searchbar_chars = request.form.get('searchbar_chars', "")
    
    try: 
        res = Client.get_all_clients(page=page, page_size=page_size, searchbar_chars=searchbar_chars)
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