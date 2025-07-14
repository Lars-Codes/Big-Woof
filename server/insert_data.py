import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import app
from models.db import db
from models.organisms.client import Client
from models.organisms.pet import Pet
from models.organisms.emergency_contact import EmergencyContact
from models.organisms.vet import Vet
from models.contact_info import ContactInfo
from models.logistics.appointment import Appointment
from models.logistics.appointment_stats import AppointmentStats
from models.finances.client_payment_types import ClientPaymentTypes
from models.files.client_files import ClientFiles
from models.misc.sticky_notes import StickyNotes
from models.timemachine.added_time import AddedTime
from models.finances.additional_costs import AdditionalCosts

import random
from datetime import datetime, date, time, timedelta
from sqlalchemy.exc import SQLAlchemyError

# Sample data arrays (same as your original file)
first_name = [
    "Aiden", "Olivia", "Liam", "Emma", "Noah", "Ava", "Elijah", "Sophia", "Lucas", "Isabella",
    "Mason", "Mia", "Logan", "Charlotte", "Ethan", "Amelia", "James", "Harper", "Alexander", "Evelyn",
    "Henry", "Abigail", "Jackson", "Emily", "Sebastian", "Elizabeth", "Owen", "Mila", "Samuel", "Ella",
    "Matthew", "Avery", "Joseph", "Sofia", "Levi", "Camila", "Mateo", "Aria", "David", "Scarlett",
    "John", "Victoria", "Wyatt", "Madison", "Carter", "Luna", "Julian", "Grace", "Luke", "Chloe",
    "Grayson", "Penelope", "Isaac", "Layla", "Jayden", "Riley", "Theodore", "Zoey", "Gabriel", "Nora",
    "Anthony", "Lily", "Dylan", "Eleanor", "Leo", "Hannah", "Lincoln", "Lillian", "Jaxon", "Addison",
    "Asher", "Aubrey", "Christopher", "Ellie", "Josiah", "Stella", "Andrew", "Natalie", "Thomas", "Zoe",
    "Joshua", "Leah", "Ezra", "Hazel", "Hudson", "Violet", "Charles", "Aurora", "Caleb", "Savannah",
    "Isaiah", "Audrey", "Ryan", "Brooklyn", "Nathan", "Bella", "Adrian", "Claire", "Christian", "Skylar"
]

last_name = [
    "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez",
    "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin",
    "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson",
    "Walker", "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores",
    "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell", "Carter", "Roberts",
    "Gomez", "Phillips", "Evans", "Turner", "Diaz", "Parker", "Cruz", "Edwards", "Collins", "Reyes",
    "Stewart", "Morris", "Morales", "Murphy", "Cook", "Rogers", "Gutierrez", "Ortiz", "Morgan", "Cooper",
    "Peterson", "Bailey", "Reed", "Kelly", "Howard", "Ramos", "Kim", "Cox", "Ward", "Richardson",
    "Watson", "Brooks", "Chavez", "Wood", "James", "Bennett", "Gray", "Mendoza", "Ruiz", "Hughes",
    "Price", "Alvarez", "Castillo", "Sanders", "Patel", "Myers", "Long", "Ross", "Foster", "Jimenez"
]

city = [
    "Springfield", "Rivertown", "Lakeside", "Fairview", "Oakwood",
    "Maplewood", "Brookfield", "Cedarville", "Franklin", "Georgetown",
    "Hillcrest", "Kingsport", "Milford", "Northwood", "Pinehurst",
    "Ridgefield", "Summit", "Trenton", "Unionville", "Westfield",
    "Ashford", "Bayside", "Clayton", "Danbury", "Easton",
    "Farmington", "Glenwood", "Hamilton", "Inverness", "Jamestown",
    "Kirkland", "Lakemont", "Mansfield", "Norwood", "Oakridge",
    "Parkdale", "Quincy", "Rosemont", "Shady Grove", "Torrington",
    "Upland", "Vernon", "Weston", "Yorktown", "Zion"
]

state = [
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
    "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
    "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
    "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
    "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
]

pet_grooming_notes = [
    "Dog is nervous around clippers.", "Prefers warm water baths.", "Allergic to certain shampoos.",
    "Owner requests blueberry facial every visit.", "Aggressive when touched near tail.",
    "Likes belly rubs before grooming.", "Sensitive paws; use caution.", "Matting under ears requires extra care.",
    "Owner prefers short trim all over.", "Regular anal gland expression needed.", "Easily startled by loud noises.",
    "Senior dog – be gentle and slow.", "Request for nail grinding instead of clipping.",
    "Avoid spraying water directly on face.", "Dog gets along well with other pets.",
    "Prefers being dried with a towel.", "Has arthritis – handle joints gently.", "Do not use scented sprays.",
    "Prone to hot spots on back legs.", "Cat is fearful – use calming spray.", "Prefers being brushed before bath.",
    "Owner brings their own shampoo.", "Add bandana after grooming.", "Pet is crate-trained and calm.",
    "Use hypoallergenic shampoo only.", "Doesn't like blow dryer noise.", "Please clean ears thoroughly.",
    "Trim tail feathering slightly.", "Dog loves treats – use during brushing.", "Matted tail – may need to be shaved.",
    "Schedule next appointment in 6 weeks.", "Use deshedding brush on undercoat.", "Sensitive around eyes – no scissors there.",
    "Remove loose hair from underbelly.", "Cat requires sedation for grooming.", "Avoid trimming whiskers.",
    "Prefers owner to be nearby during grooming.", "Check for ticks around neck area.", "Brush teeth if time allows.",
    "Pet has flea allergy – inspect skin closely.", "Leave longer hair on ears.", "Request for seasonal trim style.",
    "Doesn't like leash – carry if needed.", "Clip nails extra short today.", "Friendly and cooperative.",
    "Owner asked for mohawk cut again.", "Include bow on collar post-groom.", "Apply paw balm after bath.",
    "Gets anxious after 30 minutes – keep session short.", "Trim eyebrows but leave some length."
]

vet_notes = [
    "Administered annual rabies vaccination.", "Recommended dental cleaning within 3 months.",
    "Treated for ear infection in left ear.", "Prescribed antibiotics for skin condition.",
    "Dog is due for heartworm test next visit.", "Noticed mild hip dysplasia – monitor mobility.",
    "Vaccinated for bordetella (kennel cough).", "Client declined flea and tick medication today.",
    "Performed routine wellness exam – no issues found.", "Cleaned and expressed anal glands.",
    "Noted weight gain – suggested diet adjustment.", "Removed ticks during exam.",
    "Client asked about microchipping options.", "Referred to orthopedic specialist for limp.",
    "Performed nail trim during check-up.", "Follow-up needed for allergy testing.",
    "Prescribed anti-itch medication for dermatitis.", "Pet has heart murmur – continue monitoring.",
    "Suggested joint supplements for arthritis.", "Vaccinations are up to date.",
    "Treated for mild conjunctivitis – eye drops prescribed.", "Bloodwork within normal limits.",
    "Owner requested health certificate for travel.", "Scheduled spay/neuter for next visit.",
    "Ear mites found – treated with drops.", "Behavioral consultation recommended for anxiety.",
    "Fecal exam negative for parasites.", "Treated hotspot on rear leg.", "Advised dental chew usage daily.",
    "Vaccinated for leptospirosis today.", "Prescribed ear cleanser for recurring buildup.",
    "Noted cracked tooth – recommend dental x-rays.", "Checked lump on abdomen – benign.",
    "Pet anxious during exam – suggested sedative for future.", "Removed dewclaws during surgery.",
    "Started monthly flea preventative plan.", "Increased dosage of thyroid medication.",
    "Dog may have food allergy – recommend diet trial.", "Cleaned minor wound – applied topical antibiotic.",
    "Prescribed medication for urinary tract infection.", "Weight steady – continue current feeding schedule."
]

relationships = ["mom", "dad", "sister", "brother", "roommate", "friend", "partner", "girlfriend", "boyfriend", "cousin", "uncle", "grandma", "grandpa"]

document_types = ["Vaccination record", "Contract agreement", "Receipt", "Invoice", "Rabies record", "Other"]

def generate_phone():
    return f"{random.randint(100, 999)}{random.randint(100, 999)}{random.randint(1000, 9999)}"

def generate_email(fname, lname):
    return f"{fname.lower()}.{lname.lower()}{random.randint(1, 999)}@example.com"

def generate_address():
    return {
        "street_address": f"{random.randint(100, 9999)} {random.choice(['Main', 'Oak', 'First', 'Second', 'Park', 'Elm', 'Washington', 'Maple'])} {random.choice(['St', 'Ave', 'Rd', 'Blvd', 'Dr'])}",
        "city": random.choice(city),
        "state": random.choice(state),
        "zip": f"{random.randint(10000, 99999)}"
    }

def create_data():
    with app.app_context():
        try:
            num_clients = 100
            print(f"Creating {num_clients} clients with associated data...")
            
            for i in range(1, num_clients + 1):
                print(f"Creating client {i}/{num_clients}")
                
                # Create client contact info
                address = generate_address()
                client_fname = random.choice(first_name)
                client_lname = random.choice(last_name)
                
                contact_info = ContactInfo(
                    primary_phone=generate_phone(),
                    secondary_phone=generate_phone() if random.choice([True, False]) else None,
                    email=generate_email(client_fname, client_lname),
                    street_address=address["street_address"],
                    city=address["city"],
                    state=address["state"],
                    zip=address["zip"]
                )
                
                # Create client using proper constructor
                client = Client(
                    fname=client_fname,
                    lname=client_lname,
                    contact_info=contact_info,
                    notes=random.choice(pet_grooming_notes),
                    num_pets=0,
                    favorite=random.choice([0, 0, 0, 1])  # 25% chance of being favorite
                )
                
                db.session.add(client)
                db.session.flush()  # Get the client ID
                
                # Generate profile picture using the existing auto-generation functionality
                # filename = f"profile-{client.id}.jpg"
                # try:
                #     profile_pic_response = Client.upload_profile_picture(
                #         client.id, 
                #         image=None, 
                #         filename=filename, 
                #         ext="jpg", 
                #         initial_generation=1
                #     )
                #     print(f"  Generated profile picture for client {client.id}")
                # except Exception as e:
                #     print(f"  Warning: Failed to generate profile picture for client {client.id}: {e}")
                
                # ...rest of your existing code for creating appointment stats, emergency contacts, etc...
                
                # Create appointment stats (using direct assignment since __init__ is empty)
                appointment_stats = AppointmentStats()
                appointment_stats.client_id = client.id
                
                appointment_stats.late = random.randint(0, 5)
                appointment_stats.no_shows = random.randint(0, 3)
                appointment_stats.cancelled = random.randint(0, 4)
                appointment_stats.cancelled_late = random.randint(0, 2)
                db.session.add(appointment_stats)
                
                # Create payment type association
                payment_type = ClientPaymentTypes(
                    payment_type_id=random.randint(1, 6),
                    client_id=client.id
                )
                db.session.add(payment_type)
                
                # Create 1-2 emergency contacts
                num_emergency_contacts = random.randint(1, 2)
                for j in range(num_emergency_contacts):
                    ec_address = generate_address()
                    ec_fname = random.choice(first_name)
                    ec_lname = random.choice(last_name)
                    
                    ec_contact_info = ContactInfo(
                        primary_phone=generate_phone(),
                        secondary_phone=generate_phone() if random.choice([True, False]) else None,
                        email=generate_email(ec_fname, ec_lname),
                        street_address=ec_address["street_address"],
                        city=ec_address["city"],
                        state=ec_address["state"],
                        zip=ec_address["zip"]
                    )
                    
                    emergency_contact = EmergencyContact(
                        fname=ec_fname,
                        lname=ec_lname,
                        contact_info=ec_contact_info,
                        relationship=random.choice(relationships),
                        client_id=client.id
                    )
                    db.session.add(emergency_contact)
                
                # Create 1-5 vets
                num_vets = random.randint(1, 5)
                for k in range(num_vets):
                    vet_address = generate_address()
                    vet_fname = random.choice(first_name)
                    vet_lname = random.choice(last_name)
                    
                    vet_contact_info = ContactInfo(
                        primary_phone=generate_phone(),
                        secondary_phone=generate_phone() if random.choice([True, False]) else None,
                        email=generate_email(vet_fname, vet_lname),
                        street_address=vet_address["street_address"],
                        city=vet_address["city"],
                        state=vet_address["state"],
                        zip=vet_address["zip"]
                    )
                    
                    vet = Vet(
                        fname=vet_fname,
                        lname=vet_lname,
                        client_id=client.id,
                        contact_info=vet_contact_info,
                        notes=random.choice(vet_notes)
                    )
                    db.session.add(vet)
                
                # Create 1-5 pets
                num_pets = random.randint(1, 5)
                client.num_pets = num_pets
               
                pet_id = None  
                pets_created = []
                for l in range(num_pets):
                    pet = Pet(
                        client_id=client.id,
                        name=random.choice(first_name),
                        age=random.randint(1, 18),
                        breed_id=random.randint(1, 25),
                        size_tier_id=random.randint(1, 4),
                        notes=random.choice(pet_grooming_notes),
                        weight=random.randint(5, 80),
                        coat_type_id=random.randint(1, 4),
                        gender=random.choice([0, 1]),
                        fixed=random.choice([0, 1])
                    )
                    
                    db.session.add(pet)
                    db.session.flush()
                    pets_created.append(pet)
                    pet_id = pet.id 
                    
                # Add this after creating pets and before creating appointments (around line 270)

                # Create additional costs for services (1-3 records)
                num_service_costs = random.randint(1, 3)
                for cost_idx in range(num_service_costs):
                    service_cost = AdditionalCosts(
                        client_id=client.id,
                        pet_id=None,
                        appointment_id=None,
                        added_for_service=1,  # This is for service
                        added_for_mile=0,
                        added_cost=round(random.uniform(5.0, 50.0), 2),
                        is_percentage=random.choice([0, 1]),
                        service=None,
                        service_id=random.randint(1, 10),  # Assuming you have services 1-10
                        added_cost_per_mile=None,
                        added_cost_per_mile_is_percent=None,
                        reason=random.choice([
                            "Difficult coat condition",
                            "Extra matting removal",
                            "Behavioral issues",
                            "Premium shampoo requested",
                            "Additional time needed"
                        ])
                    )
                    db.session.add(service_cost)
                
                # Create travel costs (0-2 records)
                if random.choice([True, False]):
                    num_travel_costs = random.randint(1, 2)
                    for travel_idx in range(num_travel_costs):
                        travel_cost = AdditionalCosts(
                            client_id=client.id,
                            pet_id=None,
                            appointment_id=None,
                            added_for_service=0,
                            added_for_mile=1,  # This is for mileage
                            added_cost=None,
                            is_percentage=None,
                            service=None,
                            service_id=None,
                            added_cost_per_mile=round(random.uniform(0.50, 2.00), 2),
                            added_cost_per_mile_is_percent=random.choice([0, 1]),
                            reason=random.choice([
                                "Remote location",
                                "Gas price adjustment",
                                "Long distance travel",
                                "Traffic compensation"
                            ])
                        )
                        db.session.add(travel_cost)
                
                # Create other additional costs (1-2 records)
                num_other_costs = random.randint(1, 2)
                for other_idx in range(num_other_costs):
                    other_cost = AdditionalCosts(
                        client_id=client.id,
                        pet_id=None,
                        appointment_id=None,
                        added_for_service=0,
                        added_for_mile=0,
                        added_cost=round(random.uniform(5.0, 30.0), 2),
                        is_percentage=random.choice([0, 1]),
                        service=None,
                        service_id=None,
                        added_cost_per_mile=None,
                        added_cost_per_mile_is_percent=None,
                        reason=random.choice([
                            "Special equipment rental",
                            "Emergency call fee",
                            "Holiday surcharge",
                            "Last minute booking fee",
                            "Cleaning fee"
                        ])
                    )
                    db.session.add(other_cost)
                
                # Create added time for services (1-3 records)
                num_service_time = random.randint(1, 3)
                for time_idx in range(num_service_time):
                    service_time = AddedTime(
                        client_id=client.id,
                        pet_id=None,
                        appointment_id=None,
                        added_for_service=1,  # This is for service
                        service_id=random.randint(1, 10),  # Assuming you have services 1-10
                        time_type="minutes",
                        additional_time=random.randint(15, 60),
                        reason=random.choice([
                            "Nervous pet needs extra time",
                            "Heavy matting requires patience",
                            "Senior pet needs gentle handling",
                            "First-time client orientation",
                            "Complex coat pattern"
                        ])
                    )
                    db.session.add(service_time)
                
                # Create other added time (0-2 records)
                if random.choice([True, False]):
                    num_other_time = random.randint(1, 2)
                    for other_time_idx in range(num_other_time):
                        other_time = AddedTime(
                            client_id=client.id,
                            pet_id=None,
                            appointment_id=None,
                            added_for_service=0,
                            service_id=None,
                            time_type="minutes",
                            additional_time=random.randint(10, 45),
                            reason=random.choice([
                                "Equipment setup time",
                                "Client consultation",
                                "Photo session",
                                "Waiting for pet to calm down",
                                "Cleanup after messy pet"
                            ])
                        )
                        db.session.add(other_time)
                
                num_past_appointments = random.randint(2, 5)
                for m in range(num_past_appointments):
                    appointment_date = datetime.now().date() - timedelta(days=random.randint(1, 365))
                    start_time = time(hour=random.randint(8, 16), minute=random.choice([0, 15, 30, 45]))
                    end_time = time(hour=start_time.hour + random.randint(1, 3), minute=start_time.minute)
                    
                    # Create appointment with explicit column assignments
                    appointment = Appointment()
                    appointment.client_id = client.id
                    appointment.pet_id = pet_id
                    appointment.type = "single"
                    appointment.date = appointment_date
                    appointment.start_time = start_time
                    appointment.end_time = end_time
                    appointment.appointment_status = random.choice(["completed", "completed", "completed", "late", "no-show", "cancelled"])
                    appointment.payment_status = random.choice(["paid", "paid", "paid", "unpaid", "paid late"])
                    appointment.payment_method = random.choice(["cash", "credit", "debit", "venmo", "paypal"])
                    appointment.estimated_cost = random.randint(30, 150)
                    appointment.final_cost = random.randint(30, 150)
                    appointment.estimated_time = random.randint(60, 180)
                    appointment.notes = random.choice(pet_grooming_notes)
                    
                    # Add and flush immediately to ensure client_id is set
                    db.session.add(appointment)
                    db.session.flush()
                
                # Create 1-4 upcoming appointments - same fix
                num_upcoming_appointments = random.randint(1, 4)
                for n in range(num_upcoming_appointments):
                    appointment_date = datetime.now().date() + timedelta(days=random.randint(1, 90))
                    start_time = time(hour=random.randint(8, 16), minute=random.choice([0, 15, 30, 45]))
                    end_time = time(hour=start_time.hour + random.randint(1, 3), minute=start_time.minute)
                    
                    appointment = Appointment()
                    appointment.client_id = client.id
                    appointment.pet_id = pet_id
                    appointment.type = "single"
                    appointment.date = appointment_date
                    appointment.start_time = start_time
                    appointment.end_time = end_time
                    appointment.estimated_cost = random.randint(30, 150)
                    appointment.estimated_time = random.randint(60, 180)
                    appointment.notes = random.choice(pet_grooming_notes)
                    db.session.add(appointment)
                    db.session.flush()

                # Create 1-3 additional costs
                num_documents = random.randint(1, 3)
                for o in range(num_documents):
                    document = ClientFiles(
                        client_id=client.id,
                        document_name=f"Document_{random.randint(1000, 9999)}",
                        document_url=f"/fake/path/to/document_{random.randint(1000, 9999)}.pdf",
                        document_type=random.choice(document_types),
                        description=random.choice(["Medical records", "Vaccination proof", "Contract copy", "Receipt copy", "Insurance docs"]),
                        initial_filename=f"original_file_{random.randint(1000, 9999)}.pdf",
                        pet_id=random.choice(pets_created).id if pets_created and random.choice([True, False]) else None
                    )
                    db.session.add(document)
                
                # Create 1-2 sticky notes
                num_sticky_notes = random.randint(1, 2)
                for p in range(num_sticky_notes):
                    note_text = random.choice([
                        "Call before next appointment",
                        "Prefers morning appointments", 
                        "Cash payment only",
                        "Bring treats for nervous dog",
                        "Check vaccination records",
                        "Update contact information",
                        "Discount applied - regular customer"
                    ])
                    note_date = datetime.now() - timedelta(days=random.randint(1, 30))
                    pet_id = random.choice(pets_created).id if pets_created and random.choice([True, False]) else None
                    
                    sticky_note = StickyNotes(
                        client_id=client.id,
                        note=note_text,
                        date=note_date,
                        pet_id=pet_id
                    )
                    db.session.add(sticky_note)
                
                # Commit each client individually for easier debugging
                db.session.commit()
                # print(f"Successfully created client {i} with profile picture")
                print(f"Successfully created client {i}!")                
            
            # print(f"Successfully created {num_clients} clients with all associated data and profile pictures!")
            print(f"Successfully created {num_clients} clients with all associated data!")
            
        except SQLAlchemyError as e:
            db.session.rollback()
            print(f"Database error: {e}")
        except Exception as e:
            db.session.rollback()
            print(f"Error: {e}")
            import traceback
            traceback.print_exc()

if __name__ == "__main__":
    create_data()