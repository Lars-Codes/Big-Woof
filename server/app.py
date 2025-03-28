from flask import Flask, jsonify, request, Response, url_for
from models.db import db
from flask_cors import CORS
from dotenv import load_dotenv
import os 
from flask_migrate import Migrate

app = Flask(__name__)

CORS(app)
@app.before_request
def handle_preflight():
    if request.method == "OPTIONS":
        res = Response()
        res.headers['X-Content-Type-Options'] = '*'
        return res
    
load_dotenv()
basedir = os.path.abspath(os.path.dirname(__file__))
database_file = os.path.join(basedir, os.environ.get('SQLALCHEMY_DATABASE_URI'))
database_uri = 'sqlite:///' + database_file
app.config['SQLALCHEMY_DATABASE_URI'] = database_uri
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

migrate = Migrate(app, db)

if __name__ == "__main__":
    app.run()