from flask import jsonify, g, Blueprint, request, make_response
from backend import app
from backend.services import auth_service
from backend.services.otp_service import generate_otp, verify_otp, reset_password
from ..services.authenticate import authenticate
from ..services.security_util import decode_email
from ..services.common import *

otp_api = Blueprint('otp_api', __name__)


@otp_api.route("/GenerateOTP", methods=['POST'])
@authenticate
def generate_otp_api():
    token = request.headers['token']

    data = request.json
    email = decode_email(token)

    message = generate_otp(email=email)

    if message == "failure":
        return make_response(jsonify({"status": "failure", "message": "user does not exist"})), 500
    else:
        return jsonify({ "status": "success", "data": "OTP Sent to verify..." })


@otp_api.route("/GenerateOTPResetPassword", methods=['POST'])
def generate_otp_reset_password_api():

    data = request.json
    email = data['email']

    message = generate_otp(email=email)

    if message == "failure":
        return make_response(jsonify({"status": "failure", "message": "user does not exist"})), 500
    else:
        return jsonify({ "status": "success", "data": "OTP Sent to verify..." })



@otp_api.route("/VerifyOTP", methods=['POST'])
@authenticate
def verify_otp_api():
    token = request.headers['token']

    data = request.json
    email = decode_email(token)

    otp = data['otp']

    message = verify_otp(otp=otp, email=email)

    if message == "success":
        return jsonify({ "status": "success", "data": "otp verified" })
    else:
        return make_response(jsonify({"status": "failure", "message": "OTP cannot be verified. Try Again."})), 500


@otp_api.route("/VerifyOTPResetPassword", methods=['POST'])
def verify_otp_reset_password_api():

    data = request.json
    email = data['email']
    otp = data['otp']

    message = verify_otp(otp=otp, email=email)

    if message == "success":
        return jsonify({ "status": "success", "data": "otp verified" })
    else:
        return make_response(jsonify({"status": "failure", "message": "OTP cannot be verified. Try Again."})), 500


@otp_api.route("/ResetPassword", methods=['POST'])
def reset_password_via_otp_api():

    data = request.json
    email = data['email']
    otp = data['otp']
    password = data['password']

    message = reset_password(otp=otp, email=email, password=password)

    if message == "success":
        return jsonify({ "status": "success", "data": "otp verified" })
    else:
        return make_response(jsonify({"status": "failure", "message": "OTP cannot be verified. Try Again."})), 500