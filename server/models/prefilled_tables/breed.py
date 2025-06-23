from models.db import db
from sqlalchemy.exc import SQLAlchemyError
from flask import jsonify

class Breed(db.Model):
    __tablename__ = "breed"

    id = db.Column(db.Integer, primary_key = True)  
    name = db.Column(db.String(50), nullable = False)  
    
    def __init__(self, name):
        self.name = name 
        
    @classmethod 
    def populate_prefilled_values(cls):
        if db.session.query(cls).first():
            print("Breed already populated. Skipping.")
            return
        else: 
            labrador_retriever = Breed("Labrador Retriever")
            french_bulldog = Breed("French Bulldog")
            golden_retriever = Breed("Golden Retriever")
            german_shepherd = Breed("German Shepherd")
            poodle = Breed("Poodle")
            bulldog = Breed("Bulldog")
            beagle = Breed("Beagle")
            rottweiler = Breed("Rottweiler")
            dachshund = Breed("Dachshund")
            german_shorthaired_pointer = Breed("German Shorthaired Pointer")
            yorkshire_terrier = Breed("Yorkshire Terrier")
            boxer = Breed("Boxer")
            siberian_husky = Breed("Siberian Husky")
            cavalier_king_charles_spaniel = Breed("Cavalier King Charles Spaniel")
            doberman_pinscher = Breed("Doberman Pinscher")
            great_dane = Breed("Great Dane")
            miniature_schnauzer = Breed("Miniature Schnauzer")
            australian_shepherd = Breed("Australian Shepherd")
            shih_tzu = Breed("Shih Tzu")
            boston_terrier = Breed("Boston Terrier")
            bernese_mountain_dog = Breed("Bernese Mountain Dog")
            pomeranian = Breed("Pomeranian")
            havanese = Breed("Havanese")
            english_springer_spaniel = Breed("English Springer Spaniel")
            shetland_sheepdog = Breed("Shetland Sheepdog")
            try: 
                db.session.add(labrador_retriever)
                db.session.add(french_bulldog)
                db.session.add(golden_retriever)
                db.session.add(german_shepherd)
                db.session.add(poodle)
                db.session.add(bulldog)
                db.session.add(beagle)
                db.session.add(rottweiler)
                db.session.add(dachshund)
                db.session.add(german_shorthaired_pointer)
                db.session.add(yorkshire_terrier)
                db.session.add(boxer)
                db.session.add(siberian_husky)
                db.session.add(cavalier_king_charles_spaniel)
                db.session.add(doberman_pinscher)
                db.session.add(great_dane)
                db.session.add(miniature_schnauzer)
                db.session.add(australian_shepherd)
                db.session.add(shih_tzu)
                db.session.add(boston_terrier)
                db.session.add(bernese_mountain_dog)
                db.session.add(pomeranian)
                db.session.add(havanese)
                db.session.add(english_springer_spaniel)
                db.session.add(shetland_sheepdog)
                db.session.commit()
                print("Prefilled values for breed.")
            except SQLAlchemyError as e:
                db.session.rollback()
                print(f"Error inserting prefilled breeds on app start: {e}")
            except Exception as e: 
                db.session.rollback()
                print(f"Error inserting prefilled breeds on app start:: {e}")
                
    @classmethod 
    def get_breeds(cls):
        try: 
            breeds = db.session.query(Breed).all()
            
            # Prepare data
            breeds = [
                {
                    "breed_id": breed.id, 
                    "breed": breed.name
                }
                for breed in breeds 
            ]
            
            return jsonify({
                "success": 1, 
                "data": breeds
            }) 
    
        except SQLAlchemyError as e: 
            db.session.rollback()
            print(f"Database error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to get all breeds. Database error"}), 500,
            )    
        except Exception as e: 
            db.session.rollback()
            print(f"Unknown error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to get all breeds. Unknown error"}), 500, 
            )

    @classmethod 
    def create_breed(cls, new_breed):
        try: 
            new_breed_name = cls(new_breed)
            db.session.add(new_breed_name)
            db.session.commit()
            return jsonify({
                "success": 1, 
                "message": "Breed created succesfully",
                "breed_id": new_breed_name.id
            })       
        except SQLAlchemyError as e:
            db.session.rollback()
            print(f"Database error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to create breed. Database error"}), 500,
            )
        except Exception as e: 
            db.session.rollback()
            print(f"Unknown error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to create breed. Unknown error"}), 500,
            )  
            
    @classmethod 
    def delete_breed(cls, breed_id):
        try: 
            breed = cls.query.filter_by(id=breed_id).first()

            if not breed:
                db.session.rollback()
                return jsonify({
                    "success": 0, 
                    "error": "Breed not found for specified id",
                })
                
            db.session.delete(breed)
            db.session.commit()
            return jsonify({
                "success": 1, 
                "message": "Breed deleted succesfully",
            })
    
        except SQLAlchemyError as e: 
            db.session.rollback()
            print(f"Database error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to delete breed. Database error"}), 500,
            )    
    
        except Exception as e: 
            db.session.rollback()
            print(f"Unknown error: {e}")
            return (
                jsonify({"success": 0, "error": "Failed to delete breed. Unknown error"}), 500, 
            ) 