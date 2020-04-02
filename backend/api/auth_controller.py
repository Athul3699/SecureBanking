from flask import jsonify, g, Blueprint, request, make_response
from backend import app
from backend.services import auth_service
from backend.services import auth_service2
from ..services.authenticate import authenticate
from ..services.security_util import decode_email
auth_api = Blueprint('auth_api', __name__)


@auth_api.route("/RegisterUser", methods=['POST'])
def register_user_api():
    data = request.json

    status, data = auth_service2.register_user(**data)

    if status == "success":
        return make_response(jsonify({ "status": status, "data": data })), 200
    elif status == "failure" and data == "user already exists":
        return make_response(jsonify({ "status": status, "data": data})), 304
    else:
        return make_response(jsonify({ "status": status, "data": data})), 500


@auth_api.route("/LoginUser", methods=['POST'])
def login_user_api():
    data = request.json

    status, data = auth_service2.login_user(**data)

    if status == "success":
        return make_response(jsonify({ "status": status, "data": data })), 200
    elif status == "failure" and data == "user does not exist":
        return make_response(jsonify({ "status": status, "data": data})), 304
    else:
        return make_response(jsonify({ "status": status, "data": data})), 500


@authenticate
@auth_api.route("/GetRole", methods=['GET'])
def get_role():
    app.logger.info("[GetRole]")
    if 'token' in request.headers:
        email = decode_email(request.headers['token'])
        user = get_user_account(email=email)
        if user == None:
            return jsonify(response={ "status": "failure", "errorMessage": "user does not exist"})
        else:
            return jsonify(response={"status":success, "roleId":user['role_id']})
    else:
        return jsonify(response={ "status": "failure", "errorMessage": "token does not exist"})