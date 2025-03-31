class DocumentTypes: 
    
    document_type = None 
    
    def __init__(self, document_type):
        self.document_type = document_type
        
        
    @classmethod 
    def create_document_type(cls, type):
        pass
    
    
    @classmethod 
    def get_all_document_types(cls):
        pass 
    
    @classmethod 
    def edit_document_type(cls, document_type_id, new_name):
        pass 
    
    @classmethod 
    def delete_document_type(cls, document_type_id):
        pass 
    