from flask import jsonify, g, Blueprint, request, make_response
from backend import app
from backend.services import auth_service
from backend.services.otp_service import generate_otp, verify_otp
from ..services.authenticate import authenticate
from ..services.security_util import decode_email
from ..services.common import *

otp_api = Blueprint('otp_api', __name__)

@otp_api.route("/GenerateOTP", methods=['POST'])
def generate_otp_api():
    data = request.json
    email = data['email']

    otp, message = generate_otp(email=email)

    if message == "failure":
        return make_response(jsonify({"status": "failure", "message": "user does not exist"})), 500
    else:
        return jsonify({ "status": "success", "data": otp })


@otp_api.route("/VerifyOTP", methods=['POST'])
def verify_otp_api():
    data = request.json
    otp = data['otp']
    email = data['email']

    message = verify_otp(otp=otp, email=email)

    if message == "success":
        return jsonify({ "status": "success", "data": "otp verified" })
    else:
        return make_response(jsonify({"status": "failure", "message": "OTP cannot be verified. Try Again."})), 500