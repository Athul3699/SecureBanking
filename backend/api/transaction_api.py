from flask import Blueprint, jsonify, request
from backend import app
from backend.services.common import *
from backend.services.transaction import *
from flask_weasyprint import HTML, render_pdf
from flask import render_template
from ..services.security_util import decode_email
from ..services.common import *
import datetime
from ..services.authenticate import authenticate
import calendar
import pandas as pd
import csv
import pdfkit
transaction_api = Blueprint('transaction_api', __name__)


#Tier 1
@authenticate
@transaction_api.route("/NonCriticalTransactions", methods=['GET'])
def get_noncritical_transactions():
    app.logger.info("[api-GET-All-NonCriticalTransactions]")
    role_expected = [3,4,5]

    email = decode_email(request.headers['token'])
    user = get_user_account(email=email)
    if user == None:
        return jsonify({ "status": "failure", "errorMessage": "user does not exist"})
    else:
        role = user['role_id']

    if role in role_expected:
        transactions = get_transactions(is_critical=False)
        return jsonify({ "status": "success", "data": transactions})
    else:
        return jsonify({ "status": "failure", "errorMessage": "User does not have acces"})


@authenticate
@transaction_api.route("/ApproveMoneyTransferNonCritical", methods=['POST'])
def approve_money_transfer_noncritical():
    app.logger.info("[api-ApproveMoneyTransferNonCritical]")
    args = request.json
    transaction_id = args['id']
    role_expected = [3,4,5]

    email = decode_email(request.headers['token'])
    user = get_user_account(email=email)
    if user == None:
        return jsonify({ "status": "failure", "errorMessage": "user does not exist"})
    else:
        role = user['role_id']

    if role in role_expected:
        transaction = app.db.session.query(Transaction).filter_by(id=transaction_id, status='approved_by_destination',is_critical=False).first()
        if transaction == None:
            return jsonify({ "status": "failure", "errorMessage": "transaction does not exist"})
           
        src_account = get_customer_bank_accounts(number=transaction.from_account)
        source_balance = src_account[0]['balance']
        if transaction.type=='credit':
            update_customer_bank_account(account_number=transaction.from_account, balance=source_balance+transaction.amount)
        else:
            update_customer_bank_account(account_number=transaction.from_account, balance=source_balance-transaction.amount)
        
        if transaction.to_account != '':
            dest_account = get_customer_bank_accounts(number=transaction.to_account)
            destination_balance = dest_account[0]['balance']
            update_customer_bank_account(account_number=transaction.to_account, balance=destination_balance+transaction.amount)

        message = update_transaction(id=transaction_id, message="Transaction approved by Tier 1 employee", status='approved')


        return jsonify({ "status": "success", "message": message })
    else:
        return jsonify({ "status": "failure", "errorMessage": "User does not have acces"})


@authenticate
@transaction_api.route("/DeclineMoneyTransferNonCritical", methods=['POST'])
def decline_money_transfer_noncritical():
    app.logger.info("[api-DeclineMoneyTransferNonCritical]")
    args = request.json
    transaction_id = args['id']
    role_expected = [3,4,5]

    email = decode_email(request.headers['token'])
    user = get_user_account(email=email)
    if user == None:
        return jsonify({ "status": "failure", "errorMessage": "user does not exist"})
    else:
        role = user['role_id']

    if role in role_expected:
        transaction = app.db.session.query(Transaction).filter_by(id=transaction_id, status='approved_by_destination', is_critical=False).first()
        if transaction == None:
            return jsonify({ "status": "failure", "errorMessage": "transaction does not exist"})
        message = update_transaction(id = transaction_id, status='declined')
        return jsonify({ "status": "success", "message": message})
    else:
        return jsonify({ "status": "failure", "errorMessage": "User does not have acces"})


#Tier 2
@authenticate
@transaction_api.route("/CriticalTransactions", methods=['GET'])
def get_critical_transactions():
    app.logger.info("[api-GET-All-CriticalTransactions]")
    role_expected = [4,5]

    email = decode_email(request.headers['token'])
    user = get_user_account(email=email)
    if user == None:
        return jsonify({ "status": "failure", "errorMessage": "user does not exist"})
    else:
        role = user['role_id']

    if role in role_expected:
        transactions = get_transactions(is_critical=True)
        return jsonify({ "status": "success", "data": transactions})
    else:
        return jsonify({ "status": "failure", "errorMessage": "User does not have acces"})


@authenticate
@transaction_api.route("/ApproveMoneyTransferCritical", methods=['POST'])
def approve_money_transfer_critical():
    app.logger.info("[api-ApproveMoneyTransferCritical]")
    args = request.json
    transaction_id = args['id']
    role_expected = [3,4,5]

    email = decode_email(request.headers['token'])
    user = get_user_account(email=email)
    if user == None:
        return jsonify({ "status": "failure", "errorMessage": "user does not exist"})
    else:
        role = user['role_id']

    if role in role_expected:
        transaction = app.db.session.query(Transaction).filter_by(id=transaction_id, status='approved_by_destination', is_critical=True).first()
        if transaction == None:
            return jsonify({ "status": "failure", "errorMessage": "transaction does not exist"})

        src_account = get_customer_bank_accounts(number=transaction.from_account)
        source_balance = src_account[0]['balance']

        update_customer_bank_account(account_number=transaction.from_account, balance=source_balance-transaction.amount)
        
        if transaction.to_account != '':
            dest_account = get_customer_bank_accounts(number=transaction.to_account)
            destination_balance = dest_account[0]['balance']
            update_customer_bank_account(account_number=transaction.to_account, balance=destination_balance+transaction.amount)

        message = update_transaction(id=transaction_id, message="Transaction approved by Tier 1 employee", status='approved')

        return jsonify({ "status": "success", "message": message })
    else:
        return jsonify({ "status": "failure", "errorMessage": "User does not have acces"})


@authenticate
@transaction_api.route("/DeclineMoneyTransferCritical", methods=['POST'])
def decline_money_transfer_critical():
    app.logger.info("[api-DeclineMoneyTransferCritical]")
    args = request.json
    transaction_id = args['id']
    role_expected = [4,5]

    email = decode_email(request.headers['token'])
    user = get_user_account(email=email)
    if user == None:
        return jsonify({ "status": "failure", "errorMessage": "user does not exist"})
    else:
        role = user['role_id']

    if role in role_expected:
        transaction = app.db.session.query(Transaction).filter_by(id=transaction_id, is_critical=True).first()
        if transaction == None:
            return jsonify({ "status": "failure", "errorMessage": "transaction does not exist"})
        message = update_transaction(id = transaction_id, status='declined')
        return jsonify({ "status": "success", "message": message})
    else:
        return jsonify({ "status": "failure", "errorMessage": "User does not have acces"})

# Admin
@authenticate
@transaction_api.route("/AdminTransactions", methods=['GET'])
def get_admin_transactions():
    app.logger.info("[api-GET-All-AdminTransactions]")
    role_expected = [5]

    email = decode_email(request.headers['token'])
    user = get_user_account(email=email)
    if user == None:
        return jsonify({ "status": "failure", "errorMessage": "user does not exist"})
    else:
        role = user['role_id']

    if role in role_expected:
        transactions = get_transactions()
        return jsonify({ "status": "success", "data": transactions})
    else:
        return jsonify({ "status": "failure", "errorMessage": "User does not have acces"})


@authenticate
@transaction_api.route("/AdminApproveMoneyTransfer", methods=['POST'])
def admin_approve_money_transfer():
    app.logger.info("[api-AdminApproveMoneyTransfer]")
    args = request.json
    transaction_id = args['id']
    role_expected = [5]

    email = decode_email(request.headers['token'])
    user = get_user_account(email=email)
    if user == None:
        return jsonify({ "status": "failure", "errorMessage": "user does not exist"})
    else:
        role = user['role_id']

    if role in role_expected:
        transaction = app.db.session.query(Transaction).filter_by(id=transaction_id, status='approved_by_destination').first()
        if transaction == None:
            return jsonify({ "status": "failure", "errorMessage": "transaction does not exist"})
            
        src_account = get_customer_bank_accounts(number=transaction.from_account)
        source_balance = src_account[0]['balance']

        if transaction.type=='credit':
            update_customer_bank_account(account_number=transaction.from_account, balance=source_balance+transaction.amount)
        else:
            update_customer_bank_account(account_number=transaction.from_account, balance=source_balance-transaction.amount)
            
        if transaction.to_account != '':
            dest_account = get_customer_bank_accounts(number=transaction.to_account)
            destination_balance = dest_account[0]['balance']
            update_customer_bank_account(account_number=transaction.to_account, balance=destination_balance+transaction.amount)

        message = update_transaction(id=transaction_id, message="Transaction approved by Tier 1 employee", status='approved')

        return jsonify({ "status": "success", "message": message })
    else:
        return jsonify({ "status": "failure", "errorMessage": "User does not have acces"})


@authenticate
@transaction_api.route("/AdminDeclineMoneyTransfer", methods=['POST'])
def admin_decline_money_transfer():
    app.logger.info("[api-AdminDeclineMoneyTransfer]")
    args = request.json
    transaction_id = args['id']
    role_expected = [5]

    email = decode_email(request.headers['token'])
    user = get_user_account(email=email)
    if user == None:
        return jsonify({ "status": "failure", "errorMessage": "user does not exist"})
    else:
        role = user['role_id']

    if role in role_expected:
        transaction = app.db.session.query(Transaction).filter_by(id=transaction_id).first()
        if transaction == None:
            return jsonify({ "status": "failure", "errorMessage": "transaction does not exist"})
        message = update_transaction(id = transaction_id, status='declined')
        return jsonify({ "status": "success", "message": message})
    else:
        return jsonify({ "status": "failure", "errorMessage": "User does not have acces"})


@authenticate
@transaction_api.route("/DownloadStatements", methods=['POST'])
def downloadStatements():
    app.logger.info("[api-POST-DownloadStatements]")
    args = request.json
    print(args)
    email = decode_email(request.headers['token'])
    user = get_user_account(email=email)
    
    if user == None:
        return jsonify(response={ "status": "failure", "errorMessage": "user does not exist"})

    user_id = user['id']

    accounts = get_customer_bank_accounts(user_id=user_id,number=args['account_number'], is_active=True)
    if len(accounts)==0:
        return jsonify(response={ "status": "failure", "errorMessage": "Bank account is not tied to the user"})
    

    year = (int)(args['year'])
    month = (int)(args['month'])
    num_days = calendar.monthrange(year, month)[1]
    start_date = datetime.date(year, month, 1)
    end_date = datetime.date(year, month, num_days)

    transactions_qs = get_transactions_within(start_date,  end_date, args['account_number'])

    transactions = []
    for transaction in transactions_qs:
        transaction_row = {}
        transaction_row['from_account']=transaction['from_account']
        transaction_row['to_account']=transaction['to_account']
        transaction_row['amount']=transaction['amount']
        transaction_row['type']=transaction['type']
        transaction_row['description']=transaction['description']
        transactions.append(transaction_row)

    html = render_template('downloadStatement.html', transationDetails=transactions)
    return render_pdf(HTML(string=html))


# @transaction_api.route("/Transactions/<transaction_id>", methods=['GET'])
# def transactions(transaction_id):
#     app.logger.info("[api-GET-Transactions]")
#     transactions = get_transactions(id=request.view_args['transaction_id'])
#     return jsonify(response=transactions)

@authenticate
@transaction_api.route("/AllTransactions", methods=['GET'])
def all_transactions():
    app.logger.info("[api-GET-All-Transactions]")
    transactions = get_transactions()
    return jsonify(response=transactions)


# @transaction_api.route("/CriticalTransactions", methods=['GET'])
# def get_critical_transactions():

#     app.logger.info("[api-GET-All-CriticalTransactions]")
#     transactions = get_transactions(is_critical=True)
#     return jsonify(response=transactions)





# @transaction_api.route("/CreateTransaction", methods=['POST'])
# def create_transaction():
#     app.logger.info("[api-CreateTransaction]")
#     trasaction_params = request.json
#     trasaction_params["otp_needed"] = (bool)(trasaction_params["otp_needed"])
#     trasaction_params["last_approved_time"] = datetime.datetime.utcnow()#fromtimestamp(trasaction_params['last_approved_time'] / 1e3)
#     trasaction_params["otp_sent_time"] = datetime.datetime.utcnow()#fromtimestamp(trasaction_params['otp_sent_time'] / 1e3)
#     trasaction_params["otp_valid_till"] = datetime.datetime.utcnow()#fromtimestamp(trasaction_params['otp_valid_till'] / 1e3)
#     #perform checks on params and format them
#     #trasaction_params["is_critical"] = isCritical((int)(trasaction_params["initiated_by"]), trasaction_params["amount"])
#     message = add_transaction(**trasaction_params)
#     return jsonify(response=message)

#customer
@authenticate
@transaction_api.route("/CustomerTransactions", methods=['GET'])
def customer_transactions():
    app.logger.info("[api-GET-All-CustomerTransactions]")
    # args = request.json

    email = decode_email(request.headers['token'])
    user = get_user_account(email=email)

    if user == None:
        return jsonify({ "status": "failure", "errorMessage": "user does not exist"})
    else:
        user_id = user['id']
        bank_accounts = get_customer_bank_accounts(user_id=user_id, is_active=True)
        transactions = []
        transactions_to_return = []
        transactions_from_return = []

        for bank_account in bank_accounts:
            transactions_from = get_transactions(from_account=bank_account['number'])
            transactions_to = get_transactions(to_account=bank_account['number'])
            transactions_from_return.extend(transactions_from)
            transactions_to_return.extend(transactions_to)
        
        return jsonify({ "status": "success", "data": { "transactions_to": transactions_to_return, "transactions_from": transactions_from_return }})


# @authenticate
# @transaction_api.route("/CustomerTransactionsOutgoing", methods=['GET'])
# def customer_transactions_outgoing():
#     app.logger.info("[api-GET-All-CustomerTransactions]")
#     # args = request.json

#     email = decode_email(request.headers['token'])
#     user = get_user_account(email=email)

#     if user == None:
#         return jsonify({ "status": "failure", "errorMessage": "user does not exist"})
#     else:
#         user_id = user['id']
#         bank_accounts = get_customer_bank_accounts(user_id=user_id, is_active=True)
#         transactions = []
#         for bank_account in bank_accounts:
#             transactions_from = get_transactions(from_account=bank_account['number'])
#             transactions_to = get_transactions(to_account=bank_account['number'])
#             transactions.extend(transactions_from)
#             transactions.extend(transactions_to)
#         return jsonify({ "status": "success", "data": transactions})


# @authenticate
# @transaction_api.route("/CustomerTransactionsIncoming", methods=['GET'])
# def customer_transactions_incoming():
#     app.logger.info("[api-GET-All-CustomerTransactions]")
#     # args = request.json

#     email = decode_email(request.headers['token'])
#     user = get_user_account(email=email)

#     if user == None:
#         return jsonify({ "status": "failure", "errorMessage": "user does not exist"})
#     else:
#         user_id = user['id']
#         bank_accounts = get_customer_bank_accounts(user_id=user_id, is_active=True)
#         transactions = []
#         for bank_account in bank_accounts:
#             transactions_from = get_transactions(from_account=bank_account['number'])
#             transactions_to = get_transactions(to_account=bank_account['number'])
#             transactions.extend(transactions_from)
#             transactions.extend(transactions_to)
#         return jsonify({ "status": "success", "data": transactions})

@authenticate
@transaction_api.route("/CustomerApproveMoneyTransfer", methods=['POST'])
def customer_approve_money_transfer():
    app.logger.info("[api-CustomerApproveMoneyTransfer]")
    args = request.json
    transaction_id = args['id']
    role_expected = [1]

    email = decode_email(request.headers['token'])
    user = get_user_account(email=email)
    if user == None:
        return jsonify({ "status": "failure", "errorMessage": "user does not exist"})
    else:
        role = user['role_id']

    if role in role_expected:
        transaction = app.db.session.query(Transaction).filter_by(id=transaction_id, status='submitted').first()
        if transaction == None:
            return jsonify({ "status": "failure", "errorMessage": "transaction does not exist"})
        message = update_transaction(id = transaction_id, status='approved_by_destination')
        return jsonify({ "status": "success", "message": message})
    else:
        return jsonify({ "status": "failure", "errorMessage": "User does not have acces"})


@authenticate
@transaction_api.route("/CustomerDeclineMoneyTransferCritical", methods=['POST'])
def customer_decline_money_transfer_critical():
    app.logger.info("[api-CustomerDeclineMoneyTransferCritical]")
    args = request.json
    transaction_id = args['id']
    role_expected = [1]

    email = decode_email(request.headers['token'])
    user = get_user_account(email=email)
    if user == None:
        return jsonify({ "status": "failure", "errorMessage": "user does not exist"})
    else:
        role = user['role_id']

    if role in role_expected:
        transaction = app.db.session.query(Transaction).filter_by(id=transaction_id, status='submitted').first()
        if transaction == None:
            return jsonify({ "status": "failure", "errorMessage": "transaction does not exist"})
        message = update_transaction(id = transaction_id, status='declined')
        return jsonify({ "status": "success", "message": message})
    else:
        return jsonify({ "status": "failure", "errorMessage": "User does not have acces"})



@authenticate
@transaction_api.route("/InitiateMoneyTransfer", methods=['POST'])
def initiate_money_transfer():
    app.logger.info("[api-InitiateMoneyTransfer]")
    args = request.json
    token = request.headers['token']

    print(args)

    email = decode_email(token)
    user = get_user_account(email=email)
    
    if user == None:
        return jsonify({ "status": "failure", "errorMessage": "user does not exist"})

    user_id = user['id']

    accounts = get_customer_bank_accounts(user_id=user_id,number=args['from_account'], is_active=True)
    if len(accounts)==0:
        return jsonify({ "status": "failure", "errorMessage": "Bank account is not tied to the user"})
    
    balance = float(accounts[0]['balance'])
    trasaction_params = {}
    trasaction_params["type"] = args["type"]
    trasaction_params["from_account"] = args["from_account"] 
    trasaction_params["amount"] = args["amount"]
    
    if trasaction_params["type"]=="fund_transfer":
        if args["payee_type"]=='account':
            accounts = get_customer_bank_accounts(user_id=user_id,number=args['to_account'], is_active=True)
            if len(accounts)==0:
                return jsonify({ "status": "failure", "errorMessage": "Destination Bank account is not found"})
        else:
            if args["payee_type"]=='email':
                destination_user = get_user_account(email=args['destinationEmail'])
            else:
                destination_user = get_user_account(contact=args['destinationContact'])
            if destination_user == None:
                return jsonify({ "status": "failure", "errorMessage": "Destination Bank account does not exist"})

            destination_user_id = destination_user[0]['id']

            accounts = get_customer_bank_accounts(user_id=destination_user_id, is_active=True)
            if len(accounts)==0:
                return jsonify({ "status": "failure", "errorMessage": "Destination Bank account is not found"})
        
        trasaction_params["to_account"] = accounts[0]['number']
        if user_id == accounts[0]['user_id']:
            trasaction_params['status'] = "approved_by_destination"
        else:
            trasaction_params["status"] = "submitted"
        trasaction_params["is_critical"] = isCritical(trasaction_params["from_account"], trasaction_params["amount"])
        
    else:
        trasaction_params["is_critical"] = False
        trasaction_params["status"]='approved_by_destination'

    trasaction_params["description"] =  args["description"]
    if balance < trasaction_params["amount"]:
        trasaction_params["status"] =  'declined'
        trasaction_params["message"] =  "Insufficient Balance"
    message = add_transaction(**trasaction_params)
    return jsonify({"status":"success", "data": message})


#merchant
@authenticate
@transaction_api.route("/MerchantTransactions", methods=['GET'])
def merchant_transactions():
    app.logger.info("[api-GET-All-MerchantTransactions]")

    email = decode_email(request.headers['token'])
    user = get_user_account(email=email)

    if user == None:
        return jsonify({ "status": "failure", "errorMessage": "user does not exist"})
    else:
        user_id = user['id']
        bank_accounts = get_customer_bank_accounts(user_id=user_id, is_active=True)
        transactions = []

        transactions_to_return = []
        transactions_from_return = []
        for bank_account in bank_accounts:
            transactions_from = get_transactions(from_account=bank_account['number'])
            transactions_to = get_transactions(to_account=bank_account['number'])
            transactions_from_return.extend(transactions_from)
            transactions_to_return.extend(transactions_to)
        return jsonify({ "status": "success", "data": { "transactions_from": transactions_from, "transactions_to": transactions_to }})


@authenticate
@transaction_api.route("/MerchantApproveMoneyTransfer", methods=['POST'])
def merchant_approve_money_transfer():
    app.logger.info("[api-MerchantApproveMoneyTransfer]")
    args = request.json
    transaction_id = args['id']
    role_expected = [2]

    email = decode_email(request.headers['token'])
    user = get_user_account(email=email)
    if user == None:
        return jsonify({ "status": "failure", "errorMessage": "user does not exist"})
    else:
        role = user['role_id']

    if role in role_expected:
        transaction = app.db.session.query(Transaction).filter_by(id=transaction_id, status='submitted').first()
        if transaction == None:
            return jsonify({ "status": "failure", "errorMessage": "transaction does not exist"})
        message = update_transaction(id=transaction_id, status='approved_by_destination')
        return jsonify({ "status": "success", "message": message})
    else:
        return jsonify({ "status": "failure", "errorMessage": "User does not have acces"})


@authenticate
@transaction_api.route("/MerchantDeclineMoneyTransferCritical", methods=['POST'])
def merchant_decline_money_transfer_critical():
    app.logger.info("[api-MerchantDeclineMoneyTransferCritical]")
    args = request.json
    transaction_id = args['id']
    role_expected = [2]

    email = decode_email(request.headers['token'])
    user = get_user_account(email=email)
    if user == None:
        return jsonify({ "status": "failure", "errorMessage": "user does not exist"})
    else:
        role = user['role_id']

    if role in role_expected:
        transaction = app.db.session.query(Transaction).filter_by(id=transaction_id, status='submitted').first()
        if transaction == None:
            return jsonify({ "status": "failure", "errorMessage": "transaction does not exist"})
        message = update_transaction(id = transaction_id, status='declined')
        return jsonify({ "status": "success", "message": message})
    else:
        return jsonify({ "status": "failure", "errorMessage": "User does not have acces"})
