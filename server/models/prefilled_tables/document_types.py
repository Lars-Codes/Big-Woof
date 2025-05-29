from models.db import db 
from sqlalchemy.exc import SQLAlchemyError
from flask import jsonify

class DocumentTypes(db.Model): 
    
    __tablename__="document_types"
    
    id = db.Column(db.Integer, primary_key = True)  
    name = db.Column(db.String(50), nullable = False)  
    
    def __init__(self, document_type):
        self.name = document_type
        
    @classmethod 
    def populate_prefilled_values(cls):
        if db.session.query(cls).first():
            print("Document types already populated. Skipping.")
            return
        else: 
            vaccination = DocumentTypes("Vaccination record")
            contract = DocumentTypes("Contract agreement")
            receipt = DocumentTypes("Receipt")
            employee_contract = DocumentTypes("Employee contract")
            invoice = DocumentTypes("Invoice")
            rabies = DocumentTypes("Rabies record")
            other = DocumentTypes("Other")
            
            try: 
                db.session.add(vaccination)
                db.session.add(contract)
                db.session.add(receipt)
                db.session.add(employee_contract)
                db.session.add(invoice)
                db.session.add(rabies)
                db.session.add(other)
                db.session.commit()
                print("Prefilled values for document types.")
            except SQLAlchemyError as e:
                db.session.rollback()
                print(f"Error inserting prefilled document types on app start: {e}")
            except Exception as e: 
                db.session.rollback()
                print(f"Error inserting prefilled document types on app start:: {e}")
           
    
    @classmethod 
    def get_all_document_types(cls):
        try: 
            query = db.session.query(DocumentTypes)
            document_type_data = [
                {
                    "document_type": document_type.name, 
                    "id": document_type.id
                }
                for document_type in query  
            ] 
            return jsonify({
                "success": 1, 
                "data": document_type_data, 
            }) 

        except SQLAlchemyError as e: 
            db.session.rollback()
            print(f"Database error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to get all document types. Database error"}), 500,
            )    
        except Exception as e: 
            db.session.rollback()
            print(f"Unknown error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to get all document types. Unknown error"}), 500, 
            )  
    
    @classmethod 
    def create_document_type(cls, name):
        document_type = cls(name)
        if len(name)>50: 
            return (
                jsonify({"success": 0, "error": "Document type must be <50 chars"}), 500,
            )
        try: 
            db.session.add(document_type)
            db.session.commit()
            return jsonify({
                "success": 1, 
                "message": "Document type created succesfully",
                "document_type_id": document_type.id 
            })
            
        except SQLAlchemyError as e:
            db.session.rollback()
            print(f"Database error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to create document type. Database error"}), 500,
            )
        except Exception as e: 
            db.session.rollback()
            print(f"Unknown error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to create document type. Unknown error"}), 500,
            )  
    
    @classmethod 
    def delete_document_type(cls, document_type_id):
        try: 
            document_type = DocumentTypes.query.get(document_type_id)
            if document_type:
                db.session.delete(document_type)
                db.session.commit()
                return jsonify({"success": 1, "deleted_id": document_type_id})
            else: 
                return jsonify({"success": 0, "error": "No document type found for ID " + document_type_id})

        except SQLAlchemyError as e: 
            db.session.rollback()
            print(f"Database error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to delete document type. Database error"}), 500,
            ) 
        except Exception as e: 
            db.session.rollback()
            print(f"Unknown error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to delete document type. Unknown error"}), 500, 
            )  
            
    