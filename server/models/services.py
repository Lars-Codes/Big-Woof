"""
    When you create a service, it is a form that asks you to add service name, description, and
    prices for each tier. 
    
    All size tiers that the user created will be loaded in. Option to create new size tier. 
    Add price per size tier. Can mark n/a or price the same for all size tiers. 
    
    Creating a new service creates multiple Price objects depending on number of size tiers. The Price table has the following columns: 
    Price_ID    Service_Id(fk)      Size_Tier_Id(fk)    Price

"""

class Services:
    
    service = None 
    description = None 
    samePriceForAllTiers = False
    priceForAllTiers = None 
    
    def __init__(self, service, description, samePriceForAllTiers=False, priceForAllTiers=None): # price per size tier? 
        self.service = service 
        self.description = description
        
        if samePriceForAllTiers == True: 
            self.samePriceForAllTiers = True 
            self.priceForAllTiers = priceForAllTiers
        
    @classmethod
    def addService(cls, new_service, price_array):
        return 
    
    @classmethod 
    def getServices(cls): 
        return 
    
    @classmethod
    def editService(cls, service_id):
        return 
    
    @classmethod 
    def deleteService(cls, service_id):
        return 