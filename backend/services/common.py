from backend import app
from backend.model.manage import Authorizedrole, Maintenancelog, User, Bankaccount, Signinhistory, Transaction, Appointment
from backend.services.security_util import encrypt
from backend.services.constants import *

def get_customer_bank_accounts(**kwargs):
    accounts_qs = Bankaccount.query.filter_by(**kwargs)
    accounts = []

    # SQLAlchemy adds an additional field called '_sa_instance_state'
    # jsonify can't serialize this so we are just going to remove it
    for record in accounts_qs:
        record_dict = record.__dict__
        record_dict.pop("_sa_instance_state")
        accounts.append(record_dict)

    return { "status": "success", "data": { "data": accounts }}


def add_customer_bank_account(**kwargs):
    account = Bankaccount(**kwargs)
    app.db.session.add(account)
    app.db.session.commit()

    return {"status": "success", "data": { "message": "success" }}

def update_customer_bank_account(account_number, **kwargs):
    result = "success"
    try:
        keys = kwargs.keys()
        account = Bankaccount.query.filter_by(number=account_number).first()
        for key in keys:
            exec("account.{0} = kwargs['{0}']".format(key))
        app.db.session.commit()
    except:
        result = "error"
    return { "status": "success", "data": { "data": result }}


def get_user_account(**kwargs):
    # kwargs['email'] = 'a@a.com'
    kwargs['is_active'] = True
    profiles_qs = User.query.filter_by(**kwargs)
    profiles = []

    # SQLAlchemy adds an additional field called '_sa_instance_state'
    # jsonify can't serialize this so we are just going to remove it
    for record in profiles_qs:
        record_dict = record.__dict__
        record_dict.pop("_sa_instance_state")
        profiles.append(record_dict)

    if (len(profiles) > 0):
        return profiles[0]

    return None

def update_user_account(id, **kwargs):
    result = "error"
    try:
        keys = kwargs.keys()
        user = app.db.session.query(User).filter_by(id=id).first()

        for key in keys:
            exec("user.{0} = kwargs['{0}']".format(key))

        if kwargs["password"] is not None:
            user.password = encrypt(kwargs["password"])

        app.db.session.commit()

        result = get_user_account(id=id)
    except:
        result = "error"
    return result


def add_user_account(**kwargs):
    user = get_user_account(**kwargs)
    if user == None or len(user) == 0:
        try:
            kwargs['password'] = encrypt(kwargs['password'])
            account = User(**kwargs)
            
            app.db.session.add(account)
            app.db.session.commit()
        except Exception as e:
            print(e)
            return "error"

        return { "status": "success", "data": { "message": "Registered!" }}
    else:
        return { "status": "failure", "errorMessage": "User already exists" }

def update_employee_account(id, **kwargs):
    result = "error"
    try:
        user = app.db.session.query(User).filter_by(id=id).first()

        edit_data = {}
        if (kwargs['edit_status'] == 2):
            # import pdb; pdb.set_trace()
            edit_data = dict.copy(user.edit_data)
            user.edit_data = {}
            for key in edit_data.keys():
                exec("user.{0} = edit_data['{0}']".format(key))
        elif (kwargs['edit_status'] == 3):
            user.edit_status = 3
        else:
            keys = kwargs.keys()
            for key in keys:
                exec("user.{0} = kwargs['{0}']".format(key))
        
        app.db.session.commit()

        result = get_user_account(id=id)
    except:
        result = "error"
    return result


def add_roles():
    result = "success"

    if app.db.session.query(Authorizedrole).count()==5:
        return result
    else:
        try:
            individual_obj = Authorizedrole(
                role_name=INDIVIDUAL,
                view_customer_account=True,
                initiate_modification_personal_account=True,
                view_customer_request=True,
                decline_customer_request_critical=True,
                decline_customer_request_noncritical=True,
                initiate_credit_request=True,
                initiate_debit_request=True,
                initiate_money_transfer=True,
                initiate_creation_additional_customer_account=True
                )
            app.db.session.add(individual_obj)

            merchant_obj = Authorizedrole(
                role_name=MERCHANT,
                view_customer_request=True,
                view_merchant_account=True,
                approve_customer_request_by_merchant=True,
                decline_customer_request_critical=True,
                decline_customer_request_noncritical=True,
                initiate_credit_request=True,
                initiate_debit_request=True,
                initiate_money_transfer=True,
                initiate_modification_personal_account=True
            )
            app.db.session.add(merchant_obj)

            tier1_obj = Authorizedrole(
                role_name=TIER1,
                view_all_customer_accounts=True,
                view_customer_request=True,
                approve_customer_request_noncritical=True,
                decline_customer_request_noncritical=True,
                issue_cashier_checks=True
            )
            app.db.session.add(tier1_obj)

            tier2_obj = Authorizedrole(
                role_name=TIER2,
                view_all_customer_accounts=True,
                create_customer_account=True,
                delete_customer_account=True,
                modify_customer_account=True,
                approve_customer_request_critical=True,
                decline_customer_request_critical=True,
                initiate_modification_personal_account=True,
                initiate_modification_customer_account=True
            )
            app.db.session.add(tier2_obj)

            tier3_obj = Authorizedrole(
                role_name=TIER3,
                view_employee_account=True,
                create_employee_account=True,
                delete_employee_account =True,
                modify_employee_account=True,
                technical_account_access=True,
                approve_employee_request=True,
                decline_employee_request=True
            )
            app.db.session.add(tier3_obj)
            app.db.session.commit()
        except Exception as e:
            print(e)
            result = "error"

    return result


