from flask import Blueprint, request, jsonify 
from models.prefilled_tables.document_types import DocumentTypes
from models.files.client_files import ClientFiles

document_types_bp = Blueprint("document_types", __name__)


@document_types_bp.route('/getAllDocumentTypes', methods=["GET"]) # All payment types that are NOT associated with given client 
def getAllDocumentTypes():
    try: 
        res = DocumentTypes.get_all_document_types()
        return res  
    except Exception as e:
        print(f"Unexpected error from /getAllDocumentTypes: {e}")
        return res
    
@document_types_bp.route('/createDocumentType', methods=["POST"])
def createDocumentType():
    name = request.form.get("document_type")
    try: 
        res = DocumentTypes.create_document_type(name)
        return res 
    except Exception as e: 
        print(f"Unexpected error from /createDocumentType: {e}")
        return res

@document_types_bp.route('/deleteDocumentType', methods=["DELETE"])
def deleteDocumentType():
    id = request.form.get("document_type_id")
    try: 
        res = DocumentTypes.delete_document_type(id)
        return res 
    except Exception as e: 
        print(f"Unexpected error from /createDocumentType: {e}")
        return res

@document_types_bp.route('/uploadDocument', methods=["POST"]) # All payment types that are NOT associated with given client 
def uploadDocument():
    try: 
        
        client_id = request.form.get("client_id")
        document_name = request.form.get("document_name")
        document = request.files['document']
        document_type = request.form.get("document_type")
        description = request.form.get("description")
        pet_id = request.form.get("pet_id")
        
        if not document:
            return (
                jsonify({"success": 0, "error": "No document detected."}), 500, 
            )  
        res = ClientFiles.upload_document(client_id, document_name, document, document_type, description, pet_id)
        return res  
    except Exception as e:
        print(f"Unexpected error from /getAllDocumentTypes: {e}")
        return res

@document_types_bp.route('/deleteDocument', methods=["DELETE"])
def deleteDocument():
    document_id = request.form.get("document_id")
    try: 
        res = ClientFiles.delete_document(document_id)
        return res 
    except Exception as e: 
        print(f"Unexpected error from /deleteClient: {e}")
        return res
    
@document_types_bp.route('/previewDocument', methods=["GET"])
def previewDocument():
    document_id = request.args.get("document_id")
    try: 
        res = ClientFiles.preview_document(document_id)
        return res 
    except Exception as e: 
        print(f"Unexpected error from /previewDocument: {e}")
        return res
    
@document_types_bp.route('/downloadDocument', methods=["GET"])
def downloadDocument():
    document_id = request.args.get("document_id")
    try: 
        res = ClientFiles.download_document(document_id)
        return res 
    except Exception as e: 
        print(f"Unexpected error from /previewDocument: {e}")
        return res