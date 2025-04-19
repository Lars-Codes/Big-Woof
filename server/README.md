1. Create a .env file and paste: 
SQLALCHEMY_DATABASE_URI=sqlite:////C:\Users\19292\Documents\BW\Big-Woof\thewoofster.db

2. Initialize database 
flask db init 
flask db migrate -m "initial migration"
flask db upgrade 

3. Run the server
flask run --host=0.0.0.0