from flask import Flask, jsonify, request, Response, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from dotenv import load_dotenv
import os 
# from flask_migrate import Migrate

from models.db import db
from models.organisms.client import Client
from models.contact_info import ContactInfo
from models.prefilled_tables.user_type import UserType
from models.organisms.emergency_contact import EmergencyContact


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
db.init_app(app)

migrate = Migrate(app, db)

# TODO: ON APPLICATION DOWNLOAD SOME DATA SHOULD BE PRE-FILLED IN THE PRE-FILLED TABLES 

if __name__ == "__main__":
    app.run()