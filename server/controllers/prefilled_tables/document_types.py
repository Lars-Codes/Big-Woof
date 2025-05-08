from flask import Blueprint, request, jsonify 
from models.prefilled_tables.document_types import DocumentTypes

document_types_bp = Blueprint("document_types", __name__)


@document_types_bp.route('/getAllDocumentTypes', methods=["GET"]) # All payment types that are NOT associated with given client 
def getAllDocumentTypes():
    try: 
        res = DocumentTypes.get_all_document_types()
        return res  
    except Exception as e:
        print(f"Unexpected error from /getAllDocumentTypes: {e}")
        return res