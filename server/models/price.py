class Price:
    price_id = None # PK 
    service_id = None 
    size_tier_id = None 
    price = None 
    
    def __init__(self, size_tier_id, service_id, price):
        self.size_tier_id = size_tier_id
        self.service_id = service_id
        self.price = price 
        
    @classmethod
    def createNewPrice(cls, size_tier_id, service_id, price):
        return 
    
    @classmethod
    def getPrices(cls, service_id):
        return 
    
    @classmethod 
    def editPrice(cls, size_tier_id, service_id, new_price):
        return 
    
    @classmethod
    def deletePrice(cls, price_id):
        return 