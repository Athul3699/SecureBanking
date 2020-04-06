from flask import jsonify, g, Blueprint, request, make_response
from backend import app
from backend.services import auth_service
from backend.services import auth_service2
from ..services.authenticate import authenticate
from ..services.security_util import decode_email
auth_api = Blueprint('auth_api', __name__)
from backend.services.common import *

"""
Technical Account Access Start
"""
# not using this URL
@auth_api.route("/admin/user/getuser", methods=['POST'])
def admin_getuser_api():

    data = request.json
    email = data['email']
    
    response = get_user_account(email=email)
    return jsonify({"status": "success", "data": response})

# not using this URL
@auth_api.route("/admin/user/registeruser", methods=['POST'])
def admin_registeruser_api():

    body = request.json
    status, data = auth_service2.register_user(**body)

    if status == "success":
        return make_response(jsonify({ "status": status, "data": data })), 200
    elif status == "failure" and data == "user already exists":
        return make_response(jsonify({ "status": status, "data": data})), 500
    else:
        return make_response(jsonify({ "status": status, "data": data})), 500


# not using this URL
@auth_api.route("/admin/user/getallusers", methods=['POST'])
def admin_getallusers_api():

    data = get_admin_every_user()

    if data != None:
        return make_response(jsonify({ "status": "success", "data": data })), 200
    else:
        return make_response(jsonify({ "status": "error", "data": data})), 500


# not using this URL
@auth_api.route("/admin/user/updateuser", methods=['POST'])
def admin_updateuser_api():
    data = request.json
    email = data['email']
    response = update_user_account_email_args(email=email, **data)
    return jsonify({"status": "success", "data": response})


# not using this URL
@auth_api.route('/admin/GetFeedback', methods=['POST'])
def get_all_feedback_api():
    return get_all_feedback()
"""
Technical Account Access End
"""

@auth_api.route("/RegisterUser", methods=['POST'])
def register_user_api():
    body = request.get_json(force=True)
    
    status, data = auth_service2.register_user(**body)

    if status == "success":
        return make_response(jsonify({ "status": status, "data": data })), 200
    elif status == "failure" and data == "user already exists":
        return make_response(jsonify({ "status": status, "data": data})), 500
    else:
        return make_response(jsonify({ "status": status, "data": data})), 500


@auth_api.route("/LoginUser", methods=['POST'])
def login_user_api():
    body = request.get_json(force=True)

    status, data = auth_service2.login_user(**body)
    
    if status == "success":
        token = data
        email = decode_email(token)

        user = get_user_account(email=email)
        user_id = user["id"]
        message = add_sign_in(email=email)
        return make_response(jsonify({ "status": status, "data": data })), 200
    elif status == "failure" and data == "user does not exist":
        return make_response(jsonify({ "status": status, "data": data})), 500
    else:
        return make_response(jsonify({ "status": status, "data": data})), 500



@auth_api.route("/LogoutUser", methods=['POST'])
@authenticate
def logout_user_api():
    app.logger.info("[Log out]")
    if 'token' in request.headers:
        email = decode_email(request.headers['token'])
        user = get_user_account(email=email)
        if user == None:
            return jsonify({ "status": "failure", "errorMessage": "user does not exist"})
        else:
            message = add_sign_in(email=email,reason='log out')
            return jsonify({ "status": "success", "message": message })
    else:
        return jsonify({ "status": "failure", "errorMessage": "token does not exist"})



@auth_api.route("/GetRole", methods=['GET'])
@authenticate
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