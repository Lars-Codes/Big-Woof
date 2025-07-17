from models.db import db 

class CostPerMile(db.Model):
    
    id = db.Column(db.Integer, primary_key = True) 
    cost_per_mile = db.Column(db.Numeric(precision=10, scale=2), nullable=False)

    
    def __init__(self, cost_per_mile):
        self.cost_per_mile = cost_per_mile