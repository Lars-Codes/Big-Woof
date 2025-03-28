import sqlite3 

DATABASE = "thewoofster.db"


SCHEMA_SQL = """
    CREATE TABLE IF NOT EXISTS user_type (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        type VARCHAR(20) NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS contact_info (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        user_type_id INTEGER,
        fname varchar(50) NOT NULL,
        lname varchar(50) NOT NULL,
        primary_phone varchar(10),
        secondary_phone varchar(10),
        email varchar(320),
        street_address varchar(255),
        city varchar(50),
        state varchar(30)
        zip varchar(10),
        FOREIGN KEY (user_type_id) REFERENCES user_type(id) ON DELETE CASCADE
    );
    
    CREATE TABLE IF NOT EXISTS client (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        contact_info_id INTEGER, 
        num_pets INTEGER, 
        notes TEXT, 
        FOREIGN KEY (contact_info_id) REFERENCES contact_info(id) ON DELETE CASCADE
    );

"""


def init_db():
    with sqlite3.connect(DATABASE) as conn:
        conn.executescript(SCHEMA_SQL)  # Run the SQL schema
        print("Database initialized successfully!")

        # List tables in the database
        cur = conn.cursor()
        cur.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = cur.fetchall()
        print("Tables in database:", tables)

init_db()
