from flask import jsonify, g, Blueprint, request, make_response
from backend import app
from backend.services import auth_service
from backend.services import auth_service2
from ..services.authenticate import authenticate
from ..services.security_util import decode_email
auth_api = Blueprint('auth_api', __name__)
from ..services.common import *

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

    token = data
    email = decode_email(token)

    user = get_user_account(email=email)
    user_id = user["id"]
    
    if status == "success":
        message = add_sign_in(user_id=user_id)
        return make_response(jsonify({ "status": status, "data": data })), 200
    elif status == "failure" and data == "user does not exist":
        return make_response(jsonify({ "status": status, "data": data})), 304
    else:
        return make_response(jsonify({ "status": status, "data": data})), 500


@authenticate
@auth_api.route("/LogoutUser", methods=['POST'])
def logout_user_api():
    app.logger.info("[Log out]")
    if 'token' in request.headers:
        email = decode_email(request.headers['token'])
        user = get_user_account(email=email)
        if user == None:
            return jsonify({ "status": "failure", "errorMessage": "user does not exist"})
        else:
            # write logut functionality
            message = add_sign_in(user_id=user['id'],reason='log out')
            message = auth_service2.logout_user(email=email)
            return jsonify({ "status": "success", "message": message })
    else:
        return jsonify({ "status": "failure", "errorMessage": "token does not exist"})


@authenticate
@auth_api.route("/GetRole", methods=['GET'])
def get_role():
    if 'token' in request.headers:
        email = decode_email(request.headers['token'])
        user = get_user_account(email=email)
        if user == None:
            return jsonify({ "status": "failure", "errorMessage": "user does not exist"})
        else:
            return jsonify({"status":"success", "roleId":user['role_id']})
    else:
        return jsonify({ "status": "failure", "errorMessage": "token does not exist"})