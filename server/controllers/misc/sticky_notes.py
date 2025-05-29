from flask import Blueprint, request, jsonify 
from models.misc.sticky_notes import StickyNotes

stickies_bp = Blueprint("sticky_notes", __name__)

@stickies_bp.route('/createSticky', methods=["POST"])
def createSticky():
    client_id = request.form.get("client_id")
    pet_id = request.form.get("pet_id")
    note = request.form.get("note")
    try: 
        res = StickyNotes.create_sticky(client_id, note, pet_id)
        return res 
    except Exception as e: 
        print(f"Unexpected error from /createSticky: {e}")
        return res
    
@stickies_bp.route('/editSticky', methods=["PUT"])
def editSticky():
    client_id = request.form.get("client_id")
    sticky_id = request.form.get("sticky_id")
    note = request.form.get("note")
    try: 
        res = StickyNotes.edit_sticky(client_id, sticky_id, note)
        return res 
    except Exception as e: 
        print(f"Unexpected error from /createSticky: {e}")
        return res

@stickies_bp.route('/deleteSticky', methods=["DELETE"])
def deleteSticky():
    sticky_id = request.form.get("sticky_id")
    try: 
        res = StickyNotes.delete_sticky(sticky_id)
        return res 
    except Exception as e: 
        print(f"Unexpected error from /createSticky: {e}")
        return res