class Appointment:
    
    client_id = None 
    save_appointment_config = False 
    is_recurring = False 
    date = None 
    start_time = None 
    end_time = None 
    appointment_status_id = None 
    payment_status_id = None 
    sent_receipt = False 
    estimated_cost = None 
    final_cost = None 
    estimated_time = None 
    estimated_travel_time = None 
    notes = None 
    sent_invoice = False 
    pet_appointment_json = None 
    start_drive_location = None 
    added_cost_json = None
    added_time_json = None 
    
    def __init__(self, employee_id, client_id, date, start_time, end_time, payment_status_id, estimated_cost, final_cost, estimated_time, estimated_travel_time, notes, pet_appointment_json, start_drive_location, sent_invoice=False, is_recurring=False, sent_receipt=False, save_appointment_config=False, added_cost_json=None, added_time_json=None):
        self.employee_id = employee_id
        self.client_id = client_id 
        self.save_appointment_config = save_appointment_config
        self.is_recurring = is_recurring 
        self.date = date 
        self.start_time = start_time
        self.end_time = end_time
        # self.appointment_status_id = appointment_status_id
        self.payment_status_id = payment_status_id
        self.sent_receipt = sent_receipt
        self.estimated_cost = estimated_cost
        self.final_cost = final_cost
        self.estimated_time = estimated_time
        self.estimated_travel_time = estimated_travel_time
        self.notes = notes 
        self.sent_invoice = sent_invoice
        self.pet_appointment_json = pet_appointment_json # json with pet/service info for each pet 
        self.start_drive_location = start_drive_location
        self.added_cost_json = added_cost_json
        self.added_time_json = None
        
    @classmethod 
    def get_appointments(cls, start_date, end_date, client_id = None, pet_ids = None, service_ids = None, employee_ids = None, payment_status_arr=None, appointment_status_id_arr = None):
        pass 
    
    @classmethod 
    def create_appointment(cls, employee_id, client_id, date, start_time, end_time, payment_status_id, estimated_cost, final_cost, estimated_time, estimated_travel_time, notes, pet_appointment_json, start_drive_location, sent_invoice=False, is_recurring=False, sent_receipt=False, save_appointment_config=False, added_cost_json=None, additional_time=None, time_type_id=None, added_time_notes=None):
        appointment = cls(
            employee_id, 
            client_id,
            date, 
            start_time, 
            end_time, 
            # appointment_status_id, 
            payment_status_id, 
            estimated_cost, 
            final_cost,
            estimated_time, 
            estimated_travel_time,
            notes, 
            pet_appointment_json,
            start_drive_location,
            sent_invoice, 
            is_recurring,
            sent_receipt,
            save_appointment_config, 
            added_cost_json,
        ) 
        
        
    @classmethod 
    def delete_appointment(cls, appointment_id):
        pass 
    
    @classmethod 
    def cancel_appointment(cls, appointment_id):
        pass 
    
    @classmethod 
    def update_payment_status(cls, appointment_id, payment_status):
        pass 
    
    @classmethod 
    def update_appointment_status(cls, appointment_id, appointment_status): # cancelled, late, no-show 
        pass
    
    @classmethod 
    def remove_service(cls, appointment_id, pet_id, service_id):
        pass # Also remove any additions that are attached to that particular service. And time estimates, cost estimates. 
    
    @classmethod 
    def remove_service_additions(cls, appointment_id, service_addition_id):
        pass # remove time estimates/cost estimates 
    
    @classmethod 
    def add_service(cls, appointment_id, pet_id, service_id):
        pass 
    
    @classmethod 
    def add_service_addition(cls, pet_id, appointment_id, service_addition_id):
        pass 
    
    @classmethod 
    def update_time(cls, appointment_id, date, start_time=None, end_time=None):
        pass 
    
    @classmethod 
    def update_last_reminder_sent(cls, appointment_id, datetime):
        pass 
    
    @classmethod 
    def attach_document(cls, appointment_id, document_type_id, document):
        pass 
    
    @classmethod 
    def delete_document(cls, appointment_id, appointment_document_id):
        pass 