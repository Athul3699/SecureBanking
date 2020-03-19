from flask import jsonify, Blueprint, request
from backend import app
from ..services.appointment_service import schedule_appointment

appointment_api = Blueprint('appointment_api', __name__)

"""
request = id, edit_status={2,3}, edit_data
response = User(id=id)
"""
@appointment_api.route("/Schedule", methods=['POST'])
def schedule_appointment():
    app.logger.info("[api-schedule-appointment]")
    args = request.json
    response = schedule_appointment(args)
    return jsonify(response=response)