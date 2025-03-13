class CannedMessage():
    
    canned_email_type_id = None 
    canned_email_content = None 
    
    def __init__(self, canned_email_type, canned_email_content):
        self.canned_email_type_id = canned_email_type
        self.canned_email_content = canned_email_content
        
    @classmethod 
    def addCannedMessage(cls, canned_message_type, canned_message_content): 
        return 
    
    @classmethod 
    def getCannedMessage(cls, canned_message_type): 
        return 
    
    @classmethod
    def editCannedMessage(cls, canned_message_id, new_canned_email):
        return 
    
    @classmethod
    def deleteCannedMessage(cls, canned_message_id):
        return 