from flask import jsonify, g, Blueprint, request
from backend import app
from ..services.common import post_feedback, get_all_active_employee_requests, get_all_active_user_requests, get_admin_every_user, get_all_users, generate_account_number, add_customer_bank_account, update_customer_bank_account, get_customer_bank_accounts, get_user_account, update_user_account_email_args, update_user_account, add_user_account, update_employee_account, get_all_employees, get_all_user_bank_accounts, get_sign_in_history
from ..services.constants import *
import datetime
from ..services.authenticate import authenticate
from ..services.security_util import decode_email
from flask import send_file

admin_api = Blueprint('admin_api', __name__)


"""
GET:
    request = id
    response = User(id=id)
POST:
    request = User
    response = User
DELETE:
    request = id
    response = User
PUT
    request = any attributes of user
    response = User (modified)
"""
@admin_api.route("/EmployeeAccount", methods=['GET', 'POST', 'PUT', 'DELETE'])
def employee_account_actions():
    app.logger.info("[api-employee-account-actions]")

    response = {}
    if (request.method == 'GET'):
        response = get_user_account()
    else:
        args = request.json
        if (request.method == 'POST'):
            args['date_of_birth'] = datetime.datetime.fromtimestamp(args['date_of_birth'] / 1e3)
            response = add_user_account(**args)
        elif (request.method == 'PUT'):
            response = update_user_account(**args)
        elif (request.method == 'DELETE'):
            response = update_user_account(id=args['id'], is_active=False)
        
    return jsonify({"status": "success", "data": response})


@admin_api.route("/DeleteUser", methods=['POST'])
def delete_user_admin_related():
    app.logger.info("[api-delete-account-actions]")
    args = request.json
    response = {}

    response = update_user_account(id=args['id'], is_active=False)

    return jsonify({ "status": "success", "data": response })


@authenticate
@admin_api.route("/CreateEmployeeAccount", methods=['POST'])
def create_employee_account():
    app.logger.info("[api-employee-account-actions]")
    args = request.json

    response = add_user_account(**args)
    return jsonify({ "status": "success", "data": response })


@authenticate
@admin_api.route("/EditEmployeeAccount", methods=['POST'])
def edit_employee_account():
    app.logger.info("[api-employee-account-actions]")
    args = request.json

    response = update_user_account(id=args['id'], **args)
    return jsonify({ "status": "success", "data": response })


@authenticate
@admin_api.route("/DeleteEmployeeAccount", methods=['POST'])
def delete_employee_account():
    app.logger.info("[api-employee-account-actions]")
    args = request.json

    response = update_user_account_email_args(email=args['email'], is_active=False)
    return jsonify({ "status": "success", "data": response })


"""
request = id, edit_status={2,3}, edit_data
response = User(id=id)
"""
@admin_api.route("/ManageEmployeeRequest", methods=['POST'])
def manage_employee_request():
    app.logger.info("[api-manage-employee-request]")

    args = request.json
    args['id']
    edit_status = args['edit_status']

    response = update_employee_account(id=id, edit_mode=False, edit_status=edit_status)
    return jsonify({"status": "success", "data": response})

"""
request = id, edit_status={2,3}, edit_data
response = User(id=id)
"""
@admin_api.route("/ManageUserRequest", methods=['POST'])
def manage_user_request():
    app.logger.info("[api-manage-user-request]")

    args = request.json

    email = args['email']
    edit_status = args['edit_status']

    response = update_user_account_email_args(email=email, edit_mode=False, edit_status=edit_status)
    return jsonify({"status": "success", "data": response})


@admin_api.route("/GetAllUsers", methods=['GET'])
def get_all_users_api_admin():
    app.logger.info("[api-get-all-users]")

    response = get_all_users()
    return jsonify({"status": "success", "data": response})

@admin_api.route("/GetAllEmployees", methods=['GET'])
def get_all_employees_api():
    app.logger.info("[api-get-all-employees]")

    response = get_all_employees()
    return jsonify({"status": "success", "data": response})


@admin_api.route("/tier2/GetAllCustomerBankAccounts", methods=['GET'])
def get_all_customer_bank_accounts_tier2():
    app.logger.info("[api-get-all-customer-bank-accounts")

    response = get_customer_bank_accounts(is_active=True)

    return jsonify({ "status": "success", "data": response })


@admin_api.route("/tier2/EditCustomerBankAccount", methods=['POST'])
def edit_customer_account_tier2():
    app.logger.info("[api-edit-customer-bank-accounts")
    args = request.json

    response = update_customer_bank_account(account_number=args['number'], **args)

    return jsonify({ "status": "success", "data": response })

@admin_api.route("/tier2/CreateCustomerBankAccount", methods=['POST'])
def create_customer_account_tier2():
    app.logger.info("[CreateCustomerBankAccount]")
    args = request.json
    token = request.headers['token']

    email = decode_email(token)
    user = get_user_account(email=email)


    if user == None:
        return jsonify({ "status": "failure", "errorMessage": "user does not exist"})

    number = generate_account_number()
    account_type = args['type']
    user_id = user['id']
    balance = (float)(args['balance'])
    routing_number = '1234567' 

    result = add_customer_bank_account(number=number, type=account_type, balance=balance, user_id=user_id, routing_number=routing_number, is_active=True)
    if result=='success':
        return jsonify({ "status": "success"})
    else:
        return jsonify({ "status": "failure", "errorMessage": "error creating bank account"})


@admin_api.route("/tier2/DeleteCustomerBankAccount", methods=['POST'])
def delete_customer_account_tier2():
    app.logger.info("[api-delete-customer-bank-accounts")
    args = request.json

    response = update_customer_bank_account(account_number=args['number'], is_active=False)

    return jsonify({ "status": "success", "data": response })

@authenticate
@admin_api.route("/GetAllUsersBankAccounts", methods=['GET'])
def get_all_users_api():
    app.logger.info("[api-get-users-bank-accounts]")

    response = get_all_user_bank_accounts()
    return jsonify({"status": "success", "data": response})


@authenticate
@admin_api.route("/GetAllActiveUserRequests", methods=['GET'])
def get_all_active_user_requests_api():
    app.logger.info("[api-get-active-requests]")

    response = get_all_active_user_requests()
    return jsonify({"status": "success", "data": response})

@authenticate
@admin_api.route("/GetAllActiveEmployeeRequests", methods=['GET'])
def get_all_active_employee_requests_api():
    app.logger.info("[api-get-active-requests]")

    response = get_all_active_employee_requests()
    return jsonify({"status": "success", "data": response})


@authenticate
@admin_api.route("/GetUserActiveRequest", methods=['GET'])
def get_active_request_user_api():
    app.logger.info("[api-get-active-requests]")

    token = request.headers['token']

    response = get_user_account(email=decode_email(token), edit_mode=True)
    return jsonify({"status": "success", "data": response})



@admin_api.route('/DownloadMaintenanceLog', methods=['GET'])
def downloadFile():
    path = "logs/logger.log"
    return send_file(path, as_attachment=True)


@admin_api.route('/PostFeedback', methods=['POST'])
def post_feedback_api():
    data = request.json

    return post_feedback(user_email=data['email'], message=data['message'])


@authenticate
@admin_api.route('/GetSignInHistory', methods=['GET'])
def getSignInHistory():
    token = request.headers['token']
    email = decode_email(token)
    user = get_user_account(email=email)

    if user == None:
        return jsonify({ "status": "failure", "errorMessage": "user does not exist"})
    
    if user['role_id']==5:
        signins = get_sign_in_history()
    else:
        signins = get_sign_in_history(email=email)
    return jsonify({"status": "success", "data": signins})
