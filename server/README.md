1. Create a .env file and paste: 
SQLALCHEMY_DATABASE_URI=sqlite:////<absolute/path/to/database>

2. Initialize database 
flask db init 
flask db migrate -m "initial migration"
flask db upgrade 