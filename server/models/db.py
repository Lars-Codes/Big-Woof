from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

from models.organisms.emergency_contact import EmergencyContact 
from models.organisms.client import Client
from models.organisms.pet import Pet 
from models.organisms.vet import Vet 
from models.organisms.employee import Employee
from models.prefilled_tables.breed import Breed
from models.prefilled_tables.size_tier import SizeTier
from models.finances.bonus import Bonus 

