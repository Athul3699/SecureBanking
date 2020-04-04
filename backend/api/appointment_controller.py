from flask import jsonify, Blueprint, request
from backend import app
from ..services.appointment_service import schedule_appointment, get_appointments
from ..services.security_util import decode_email
from ..services.common import get_user_account

appointment_api = Blueprint('appointment_api', __name__)

"""
request = id, edit_status={2,3}, edit_data
response = User(id=id)
"""
@appointment_api.route("/Schedule", methods=['POST'])
def schedule_appointment_api():
    app.logger.info("[api-schedule-appointment]")
    args = request.json

    email = decode_email(request.headers['token'])
    user = get_user_account(email=email)
    if user == None:
        return jsonify({ "status": "failure", "errorMessage": "user does not exist"})

    args["user_id"] = user["id"]

    response = schedule_appointment(**args)
    return jsonify(response=response)

@appointment_api.route("/FilledSlots", methods=['GET'])
def get_appoinments_api():
    app.logger.info("[api-get-appointments]")

    appointments = get_appointments()
    print(appointments)
    return jsonify({ "status": "success", "data": appointments})