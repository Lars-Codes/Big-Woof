from flask import Blueprint, request, jsonify 
from models.logistics.services import Services
from models.finances.service_costs import ServiceCosts

services_bp = Blueprint("services_bp", __name__)

# SERVICES =========================================================================================================
@services_bp.route('/createService', methods=["POST"])
def createService():
    service_name = request.form.get("service_name")
    description = request.form.get("description")
    try:
        res = Services.create_service(service_name, description)
        return res 
    except Exception as e: 
        print(f"Unexpected error from /createService: {e}")
        return res



@services_bp.route('/updateService', methods=['PATCH'])
def updateService():
    data = {}
    possible_fields = [
        'service_name', 'description', 'service_id'
    ]
    
    for field in possible_fields:
        value = request.form.get(field)
        if value is not None:
            data[field] = value
            
    if data.get('service_id') == None: 
        return (
            jsonify({"success": 0, "error": "Key service_id must be provided"}), 500, 
        )  
        
    try:
        res = Services.update_service(**data)
        return res
    except Exception as e:
        print(f"Unexpected error from /updateService: {e}")
        return res
    

@services_bp.route('/deleteService', methods=["DELETE"])
def deleteService():
    service_id = request.form.get("service_id")
    try:
        res = Services.delete_service(service_id)
        return res 
    except Exception as e: 
        print(f"Unexpected error from /deleteService: {e}")
        return res

# SERVICE COSTS ===============================================================================

@services_bp.route('/createServiceCost', methods=["POST"])
def createServiceCost():
    service_id = request.form.get("service_id")
    service_cost = request.form.get("service_cost")
    breed_id = request.form.get("breed_id")
    size_tier_id = request.form.get("size_tier_id")
    coat_type_id = request.form.get("coat_type_id")
    hair_length_id = request.form.get("hair_length_id")
    try:
        res = ServiceCosts.add_service_cost(service_id, service_cost, breed_id, size_tier_id, coat_type_id, hair_length_id)
        return res 
    except Exception as e: 
        print(f"Unexpected error from /createServiceCost: {e}")
        return res
    

@services_bp.route('/deleteServiceCost', methods=["DELETE"])
def deleteServiceCost():
    service_cost_id = request.form.get("service_cost_id")
    try:
        res = ServiceCosts.delete_service_cost(service_cost_id)
        return res 
    except Exception as e: 
        print(f"Unexpected error from /deleteServiceCost: {e}")
        return res
    
@services_bp.route('/updateServiceCost', methods=['PATCH'])
def updateServiceCost():
    data = {}
    possible_fields = [
        'service_cost_id', 'service_cost', 'breed_id', 'size_tier_id', 'coat_type_id', 'hair_length_id'
    ]
    
    for field in possible_fields:
        value = request.form.get(field)
        if value is not None:
            data[field] = value
            
    if data.get('service_cost_id') == None: 
        return (
            jsonify({"success": 0, "error": "Key service_cost_id must be provided"}), 500, 
        )  
    try:
        res = ServiceCosts.update_service_cost(**data)
        return res
    except Exception as e:
        print(f"Unexpected error from /updateServiceCost: {e}")
        return res
    

    