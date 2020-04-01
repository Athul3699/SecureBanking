from flask import jsonify, g, Blueprint, request
from backend import app
from ..services.common import get_customer_bank_accounts, add_customer_bank_account, update_customer_bank_account, get_user_account, close_customer_bank_account
from ..services.constants import *
from ..services.security_util import decode_email
import datetime

bank_account_api = Blueprint('bank_account_api', __name__)


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
"""
@bank_account_api.route("/BankAccount", methods=['GET', 'POST', 'PUT', 'DELETE'])
def employee_account_actions():
    app.logger.info("[api-bank-account-actions]")
    args = request.json

    email = decode_email(args['token'])
    user_id = get_user_account(email=email)

    if user_id == None:
        return jsonify(response={ "status": "failure", "errorMessage": "user does not exist"})

    response = {}
    if (request.method == 'GET'):
        response = get_customer_bank_accounts(**args)
    elif (request.method == 'POST'):
        args['user_id'] = user_id
        response = add_customer_bank_account(**args)
    elif (request.method == 'PUT'):
        response = update_customer_bank_account(**args)
    else:
        response = update_customer_bank_account(account_number=args['account_number'], is_active=False)
        
    return jsonify(response=response)
