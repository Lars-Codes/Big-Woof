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
    def create_document_type(cls, type):
        pass
    
    @classmethod 
    def get_all_document_types(cls):
        try: 
            query = db.session.query(DocumentTypes)
            document_type_data = [
                {
                    "document_type": document_type.name, 
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
    def edit_document_type(cls, document_type_id, new_name):
        pass 
    
    @classmethod 
    def delete_document_type(cls, document_type_id):
        pass 
    