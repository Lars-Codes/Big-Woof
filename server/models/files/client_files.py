from models.db import db 

class ClientFiles(db.Model):
    
    __tablename__="client_files"
    id = db.Column(db.Integer, primary_key = True)  
    client_id = db.Column(db.Integer, db.ForeignKey('clients.id'), nullable=False)
    pet_id = db.Column(db.Integer, db.ForeignKey('pets.id'), nullable=True)
    appointment_id = db.Column(db.Integer, db.ForeignKey('appointments.id'), nullable=True)
    
    document_name = db.Column(db.String(50), nullable = False)
    document = db.Column(db.LargeBinary, nullable=False)  # This is the blob column
 
    document_type = db.Column(db.String(50), nullable = False) # The user selects a document type from a dropdown, prefilled table. This value is stored here 
    # exactly as listed in the table. 
    description = db.Column(db.Text, nullable = True )

    __table_args__ = (
        db.Index('idx_client_id_files', 'client_id'),
        db.Index('idx_appointment_id_files', 'appointment_id'),
    )
    
    # def __init__(self, document_name, document, document_type, client_id, description=None, pet_id=None, appointment_id=None): # DOCUMENT TYPE DEFAULTS TO "Other"
    #     self.client_id = client_id
    #     self.pet_id = pet_id
    #     self.appointment_id = appointment_id
    
    @classmethod 
    def upload_client_document(cls, client_id, document_name, document, document_type, description):
        pass