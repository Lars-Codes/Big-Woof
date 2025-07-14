from models.db import db 
from sqlalchemy.exc import SQLAlchemyError
from flask import jsonify
from datetime import datetime 
from models.organisms.client import Client 

class StickyNotes(db.Model):
    
    __tablename__ = "sticky_notes"
    id = db.Column(db.Integer, primary_key = True)  
    client_id = db.Column(db.Integer, db.ForeignKey('clients.id'), nullable=False)
    pet_id = db.Column(db.Integer, db.ForeignKey('pets.id'), nullable=True)
    note = db.Column(db.Text, nullable = True)
    date = db.Column(db.DateTime, nullable=False) 

    def __init__(self, client_id, note, date, pet_id=None):
        self.client_id = client_id
        self.note = note
        self.date = date 
        self.pet_id = pet_id
        
    __table_args__ = (
        db.Index('idx_client_id_sticky', 'client_id'),
        db.Index('idx_sticky_id', 'id'),

    ) 
    
    @classmethod 
    def create_sticky(cls, client_id, note, pet_id=None):
        client = Client.query.filter_by(id=client_id).first()
        if not client: 
            return (
                jsonify({"success": 0, "error": "Client does not exist for client_id"}), 500,
        )
        sticky = cls(client_id=client_id, note=note, date=datetime.now(), pet_id=pet_id)
        try: 
            db.session.add(sticky)
            db.session.commit()
            return jsonify({
                "success": 1, 
                "message": "Sticky note created succesfully",
                "sticky_id": sticky.id
            })
            
        except SQLAlchemyError as e:
            db.session.rollback()
            print(f"Database error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to create sticky. Database error"}), 500,
            )
        except Exception as e: 
            db.session.rollback()
            print(f"Unknown error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to create sticky. Unknown error"}), 500,
            )  
    @classmethod 
    def edit_sticky(cls, client_id, sticky_id, note):
        try: 
            sticky = cls.query.filter_by(id=sticky_id, client_id=client_id).first()
            if sticky: 
                sticky.note = note 
                db.session.commit()
                return jsonify({
                    "success": 1, 
                    "message": "Sticky succesfully updated",
                    "sticky_id": sticky_id,
                    "new_note": note 
                })
            else:  
                return jsonify({
                    "success": 0, 
                    "error": "No sticky found for sticky id " + sticky_id + " and client id " + client_id, 
                }) 
        except SQLAlchemyError as e: 
            db.session.rollback()
            print(f"Database error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to update sticky note. Database error"}), 500,
            )  
        except Exception as e: 
            db.session.rollback()
            print(f"Unknown error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to update sticky note. Unknown error"}), 500, 
            )
    
    @classmethod 
    def delete_sticky(cls, sticky_id):
        try: 
            sticky = StickyNotes.query.get(sticky_id)
            # print("notes: ", sticky.note)
            if sticky:
                db.session.delete(sticky)
                db.session.commit()
                return jsonify({"success": 1, "deleted_id": sticky_id})
            else: 
                return jsonify({"success": 0, "error": "No sticky found for ID " + sticky_id})

        except SQLAlchemyError as e: 
            db.session.rollback()
            print(f"Database error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to delete sticky note. Database error"}), 500,
            ) 
        except Exception as e: 
            db.session.rollback()
            print(f"Unknown error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to delete sticky note. Unknown error"}), 500, 
            )  
            
        