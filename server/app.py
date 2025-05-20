from flask import Flask, jsonify, request, Response, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from dotenv import load_dotenv
import os 
from flask_migrate import Migrate

from models.db import db
from models.prefilled_tables.payment_types import PaymentTypes
from models.prefilled_tables.time_types import TimeTypes
from models.prefilled_tables.document_types import DocumentTypes
from models.prefilled_tables.size_tier import SizeTier
from models.prefilled_tables.breed import Breed
from models.prefilled_tables.coat_types import CoatTypes

from controllers.organisms.client import client_bp
from controllers.organisms.pet import pet_bp
from controllers.organisms.emergency_contact import emergency_contact_bp
from controllers.organisms.vet import vet_bp
from controllers.organisms.employee import employee_bp
from controllers.prefilled_tables.payment_types import payment_types_bp
from controllers.prefilled_tables.document_types import document_types_bp

app = Flask(__name__)

CORS(app)
@app.before_request
def handle_preflight():
    if request.method == "OPTIONS":
        res = Response()
        res.headers['X-Content-Type-Options'] = '*'
        return res
    
load_dotenv()

database_uri = os.environ.get('SQLALCHEMY_DATABASE_URI')

basedir = os.path.abspath(os.path.dirname(__file__))
database_file = os.path.join(basedir, os.environ.get('SQLALCHEMY_DATABASE_URI'))

# database_uri = 'sqlite:///' + database_file

app.config['SQLALCHEMY_DATABASE_URI'] = database_uri
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True

db.init_app(app)

migrate = Migrate(app, db)

app.register_blueprint(client_bp)
app.register_blueprint(emergency_contact_bp)
app.register_blueprint(vet_bp)
app.register_blueprint(employee_bp)
app.register_blueprint(payment_types_bp)
app.register_blueprint(document_types_bp)
app.register_blueprint(pet_bp)

with app.app_context():
    # Prefill tables 
    print("Populating prefilled values...")
    PaymentTypes.populate_prefilled_values()
    TimeTypes.populate_prefilled_values()
    DocumentTypes.populate_prefilled_values()
    SizeTier.populate_prefilled_values()
    Breed.populate_prefilled_values()
    CoatTypes.populate_prefilled_values()


if __name__ == "__main__":
    app.run(debug=True)