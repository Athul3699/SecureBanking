from flask import jsonify, g, Blueprint, request
from backend import app
from ..services.common import get_user_account, update_user_account, add_user_account, update_employee_account
from ..services.constants import *
import datetime

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
    args = request.json

    response = {}
    if (request.method == 'GET'):
        response = get_user_account(**args)
    elif (request.method == 'POST'):
        args['date_of_birth'] = datetime.datetime.fromtimestamp(args['date_of_birth'] / 1e3)
        response = add_user_account(**args)
    elif (request.method == 'PUT'):
        response = update_user_account(**args)
    elif (request.method == 'DELETE'):
        response = update_user_account(id=args['id'], is_active=False)
        
    return jsonify(response=response)


"""
request = id, edit_status={2,3}, edit_data
response = User(id=id)
"""
@admin_api.route("/ManageRequest", methods=['POST'])
def manage_employee_request():
    app.logger.info("[api-manage-employee-request]")
    args = request.json

    id = 5 # args['id']
    edit_status = args['edit_status']

    response = update_employee_account(id=id, edit_mode=False, edit_status=edit_status)
    return jsonify(response=response)


"""
request = id
response = User(id=id)
"""
@admin_api.route("/GetUser", methods=['GET'])
def get_user():
    app.logger.info("[api-get-user]")
    args = request.json

    id = args['id']
    response = get_user_account(id=id)
    return jsonify(response=response)