from flask import Blueprint, request, jsonify 
from models.organisms.employee import Employee 

employee_bp = Blueprint("employees", __name__)

@employee_bp.route('/getAllEmployees', methods=['GET'])
def deleteEmergencyContact():
    try: 
        res = Employee.get_all_employees()
        return res 
    except Exception as e: 
        print(f"Unexpected error from /getAllEmployees: {e}")
        return res
    
