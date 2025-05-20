import requests
import random 

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

email = [
    f"user{i}@example.com" for i in range(1, 101)
]

street_address = [
    f"{1000 + i} Main St" for i in range(100)
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
    "Upland", "Vernon", "Weston", "Yorktown", "Zion",
    "Aberdeen", "Bellevue", "Chester", "Dover", "Elmwood",
    "Foxboro", "Greenville", "Hudson", "Ironwood", "Jacksonville",
    "Kenwood", "Lexington", "Medford", "Newport", "Orchard Park",
    "Pleasanton", "Quarryville", "Rockville", "Saddlebrook", "Timberlake",
    "Upperville", "Valleyview", "Windham", "Xenia", "Yarmouth",
    "Zephyr", "Arlington", "Bradford", "Centerville", "Dunedin",
    "Edgewater", "Fairmont", "Granite Falls", "Hampton", "Ivydale",
    "Jefferson", "Kensington", "Laurel", "Montrose", "Norwich",
    "Oakton", "Palmdale", "Queensbury", "Rochester", "Stonehaven",
    "Tiverton", "Underhill", "Vicksburg", "Weston", "Yardley",
    "Zebulon", "Alpine", "Bluffdale", "Cottonwood", "Draper"
]

state = [
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
    "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
    "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
    "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
    "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
] * 2  # repeated to make 100

zip = [
    f"{str(10000 + i).zfill(5)}" for i in range(100)
]

phone_number = [
    "123456789", "234567891", "345678912", "456789123", "567891234",
    "678912345", "789123456", "891234567", "912345678", "102938475",
    "112358132", "223344556", "334455667", "445566778", "556677889",
    "667788990", "778899001", "889900112", "990011223", "101112131",
    "111213141", "121314151", "131415161", "141516171", "151617181",
    "161718191", "171819202", "181920212", "192021222", "202122232",
    "212223242", "222324252", "232425262", "242526272", "252627282",
    "262728292", "272829303", "282930313", "293031323", "303132343",
    "313234353", "323435363", "333536373", "343637383", "353738393",
    "363839404", "373940414", "384041424", "394142434", "404243444",
    "414344454", "424445464", "434546474", "444647484", "454748494",
    "464849505", "474950515", "485051525", "495152535", "505253545",
    "515354555", "525455565", "535556575", "545657585", "555758595",
    "565859606", "575960616", "586061626", "596162636", "606263646",
    "616364656", "626465666", "636566676", "646667686", "656768696",
    "666869707", "676970717", "687071727", "697172737", "707273747",
    "717374757", "727475767", "737576777", "747677787", "757778797",
    "767879808", "777980818", "788081828", "798182838", "808283848",
    "818384858", "828485868", "838586878", "848687888", "858788898",
    "868889908", "878990918", "889091928", "899192938", "909293948",
    "919394958", "929495968", "939596978", "949697988", "959798998"
]

pet_grooming_notes = [
    "Dog is nervous around clippers.",
    "Prefers warm water baths.",
    "Allergic to certain shampoos.",
    "Owner requests blueberry facial every visit.",
    "Aggressive when touched near tail.",
    "Likes belly rubs before grooming.",
    "Sensitive paws; use caution.",
    "Matting under ears requires extra care.",
    "Owner prefers short trim all over.",
    "Regular anal gland expression needed.",
    "Easily startled by loud noises.",
    "Senior dog – be gentle and slow.",
    "Request for nail grinding instead of clipping.",
    "Avoid spraying water directly on face.",
    "Dog gets along well with other pets.",
    "Prefers being dried with a towel.",
    "Has arthritis – handle joints gently.",
    "Do not use scented sprays.",
    "Prone to hot spots on back legs.",
    "Cat is fearful – use calming spray.",
    "Prefers being brushed before bath.",
    "Owner brings their own shampoo.",
    "Add bandana after grooming.",
    "Pet is crate-trained and calm.",
    "Use hypoallergenic shampoo only.",
    "Doesn’t like blow dryer noise.",
    "Please clean ears thoroughly.",
    "Trim tail feathering slightly.",
    "Dog loves treats – use during brushing.",
    "Matted tail – may need to be shaved.",
    "Schedule next appointment in 6 weeks.",
    "Use deshedding brush on undercoat.",
    "Sensitive around eyes – no scissors there.",
    "Remove loose hair from underbelly.",
    "Cat requires sedation for grooming.",
    "Avoid trimming whiskers.",
    "Prefers owner to be nearby during grooming.",
    "Check for ticks around neck area.",
    "Brush teeth if time allows.",
    "Pet has flea allergy – inspect skin closely.",
    "Leave longer hair on ears.",
    "Request for seasonal trim style.",
    "Doesn't like leash – carry if needed.",
    "Clip nails extra short today.",
    "Friendly and cooperative.",
    "Owner asked for mohawk cut again.",
    "Include bow on collar post-groom.",
    "Apply paw balm after bath.",
    "Gets anxious after 30 minutes – keep session short.",
    "Trim eyebrows but leave some length.",
    "Groom with harness instead of neck loop.",
    "Watch for dry patches on skin.",
    "Only use cotton towels – no dryer.",
    "Owner prefers a lion cut.",
    "No cologne spray after groom.",
    "Give a treat before bath to relax.",
    "Brush tail thoroughly – tends to tangle.",
    "Dog tries to bite when touched near mouth.",
    "Check for ear mites – common with this pet.",
    "Uses pet stairs to get into tub.",
    "Prefers early morning appointments.",
    "Avoid touching hindquarters – previously injured.",
    "Use gloves – prone to biting.",
    "Blow dryer on low setting only.",
    "Bring out dog with a bandana tied.",
    "No nail polish this time.",
    "Owner will trim nails at home.",
    "Clean tear stains under eyes.",
    "Use detangler before brushing tail.",
    "Owner brings special conditioner.",
    "Clip between paw pads.",
    "Trim face in teddy bear style.",
    "Be mindful of post-surgery scar.",
    "Apply flea spray after grooming.",
    "Needs ear plucking every visit.",
    "Aggressive with other animals – keep separated.",
    "Senior cat – very sensitive.",
    "Owner requests feather trim on legs.",
    "Brush in direction of hair growth.",
    "Grooming every 4 weeks preferred.",
    "Avoid chin – has rash.",
    "Use lavender calming spray.",
    "Cat will hide in carrier – coax gently.",
    "Dog is deaf – approach from front.",
    "Give extra brushing to undercoat.",
    "Pet doesn't like feet touched.",
    "Wrap in towel during drying.",
    "Use soft-bristle brush for finishing.",
    "Only trim top of head lightly.",
    "No treats – food allergy.",
    "Clean in-between facial folds.",
    "Check tail for matting every visit.",
    "Owner wants report card after session.",
    "Dog has recurring skin condition.",
    "Tends to scoot – check anal glands.",
    "Keep ears dry – history of infections.",
    "Blow dryer causes anxiety – towel dry only.",
    "Use tearless shampoo on face.",
    "Owner will provide ear cleaner.",
    "Brush coat twice – lots of shedding.",
    "Apply sunscreen to nose (outdoor dog).",
    "Dog jumps off table – watch closely.",
    "Dog prefers being groomed lying down.",
    "Trim around paws into round shape.",
    "Owner prefers no haircut – brush and bathe only."
]

vet_notes = [
    "Administered annual rabies vaccination.",
    "Recommended dental cleaning within 3 months.",
    "Treated for ear infection in left ear.",
    "Prescribed antibiotics for skin condition.",
    "Dog is due for heartworm test next visit.",
    "Noticed mild hip dysplasia – monitor mobility.",
    "Vaccinated for bordetella (kennel cough).",
    "Client declined flea and tick medication today.",
    "Performed routine wellness exam – no issues found.",
    "Cleaned and expressed anal glands.",
    "Noted weight gain – suggested diet adjustment.",
    "Removed ticks during exam.",
    "Client asked about microchipping options.",
    "Referred to orthopedic specialist for limp.",
    "Performed nail trim during check-up.",
    "Follow-up needed for allergy testing.",
    "Prescribed anti-itch medication for dermatitis.",
    "Pet has heart murmur – continue monitoring.",
    "Suggested joint supplements for arthritis.",
    "Vaccinations are up to date.",
    "Treated for mild conjunctivitis – eye drops prescribed.",
    "Bloodwork within normal limits.",
    "Owner requested health certificate for travel.",
    "Scheduled spay/neuter for next visit.",
    "Ear mites found – treated with drops.",
    "Behavioral consultation recommended for anxiety.",
    "Fecal exam negative for parasites.",
    "Treated hotspot on rear leg.",
    "Advised dental chew usage daily.",
    "Vaccinated for leptospirosis today.",
    "Prescribed ear cleanser for recurring buildup.",
    "Noted cracked tooth – recommend dental x-rays.",
    "Checked lump on abdomen – benign.",
    "Pet anxious during exam – suggested sedative for future.",
    "Removed dewclaws during surgery.",
    "Started monthly flea preventative plan.",
    "Increased dosage of thyroid medication.",
    "Dog may have food allergy – recommend diet trial.",
    "Cleaned minor wound – applied topical antibiotic.",
    "Prescribed medication for urinary tract infection.",
    "Weight steady – continue current feeding schedule.",
    "Vaccinated for Lyme disease.",
    "Heartworm prevention up to date.",
    "Noted signs of aging – discussed pain management.",
    "Trimmed fur around eyes for better vision.",
    "Scheduled dental cleaning for next month.",
    "Suggested soft bedding for joint support.",
    "Mild tartar buildup noted.",
    "Requested x-rays for limping front leg.",
    "Reviewed blood panel results – everything normal."
]

relationships = ["mom", "dad", "sister", "brother", "roommate", "friend", "partner", "girlfriend", "boyfriend", "theyfriend", "cousin", "uncle", "grandma", "grandpa"]

num_clients_to_create = 100 

# CREATE CLIENT ============================================================
client_url = "http://localhost:5000/createClient"  
emergency_contact_url = "http://localhost:5000/createEmergencyContact"  
vet_url = "http://localhost:5000/createVet"  
payment_type_url = "http://localhost:5000/assignPaymentTypeToClient"
create_pet_url = "http://localhost:5000/createPet"


for i in range(1, num_clients_to_create): 
    client_data = {
        "fname": random.choice(first_name),
        "lname": random.choice(last_name),
        "phone_number": random.choice(phone_number),
        "secondary_phone": random.choice(phone_number),
        "email": random.choice(email),
        "street_address": random.choice(street_address),
        "city": random.choice(city),
        "state": random.choice(state),
        "zip": random.choice(zip),
        "notes": random.choice(pet_grooming_notes),  # optional
    }
    create_client_response = requests.post(client_url, data=client_data).json()
    if create_client_response.get("success") == 0: 
        print(create_client_response.get("error"))
    
    payment_type_data = {
        "client_id": i, 
        "payment_type_id": random.randint(1, 6)
    }
    assign_payment_type_res = requests.post(payment_type_url, data=payment_type_data).json()
    if assign_payment_type_res.get("success") == 0: 
        print(assign_payment_type_res.get("error"))
    
    for j in range(0, random.randint(1, 3)): 
        emergency_contact_data = {
            "user_type": "client", 
            "relationship": random.choice(relationships), 
            "fname": random.choice(first_name),
            "lname": random.choice(last_name),
            "primary_phone": random.choice(phone_number),
            "secondary_phone": random.choice(phone_number),
            "email": random.choice(email),
            "street_address": random.choice(street_address),
            "city": random.choice(city),
            "state": random.choice(state),
            "zip": random.choice(zip),
            "id": i, 
        }
        create_emergency_contact_response = requests.post(emergency_contact_url, data=emergency_contact_data).json()
        if create_emergency_contact_response.get("success") == 0: 
            print(create_emergency_contact_response.get("error"))

    for k in range(0, random.randint(1, 3)): 
        vet_data = {
            "client_id": i, 
            "fname": random.choice(first_name),
            "lname": random.choice(last_name),
            "primary_phone": random.choice(phone_number),
            "secondary_phone": random.choice(phone_number),
            "email": random.choice(email),
            "street_address": random.choice(street_address),
            "city": random.choice(city),
            "state": random.choice(state),
            "zip": random.choice(zip),
            "notes": random.choice(vet_notes),
        }
        create_vet_response = requests.post(vet_url, data=vet_data).json()
        if create_vet_response.get("success") == 0: 
            print(create_vet_response.get("error"))
            
    for l in range(0, random.randint(1, 3)):
        pet_data = {
            "client_id": i, 
            "name": random.choice(first_name), 
            "age": random.randint(1, 20), 
            "breed_id": random.randint(1, 25), 
            "size_tier_id": random.randint(1, 4),
            "notes": random.choice(pet_grooming_notes), 
            "weight": random.randint(5, 60),
            "coat_type_id": random.randint(1, 4)
        }
        create_pet_response = requests.post(create_pet_url, data=pet_data).json()
        if create_pet_response.get("success") == 0: 
            print(create_pet_response.get("error"))