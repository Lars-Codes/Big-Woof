from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

from models.organisms.emergency_contact import EmergencyContact 
from models.organisms.client import Client
from models.organisms.pet import Pet 
from models.organisms.vet import Vet 
from models.organisms.employee import Employee

from models.prefilled_tables.breed import Breed
from models.prefilled_tables.size_tier import SizeTier
from models.prefilled_tables.payment_types import PaymentTypes
from models.prefilled_tables.document_types import DocumentTypes
from models.prefilled_tables.coat_types import CoatTypes

from models.finances.bonus import Bonus 
from models.finances.online_payment_ids import OnlinePaymentIds
from models.finances.client_payment_types import ClientPaymentTypes
from models.finances.additional_costs import AdditionalCosts

from models.logistics.services import Services 
from models.logistics.appointment import Appointment
from models.logistics.appointment_stats import AppointmentStats
from models.logistics.client_homework import ClientHomework

from models.timemachine.added_time import AddedTime

from models.files.client_files import ClientFiles
