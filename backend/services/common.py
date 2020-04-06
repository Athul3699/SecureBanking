from backend import app
from backend.model.manage import IncorrectLogins, Session, Authorizedrole, Maintenancelog, User, Bankaccount, Signinhistory, Transaction, Appointment, Feedback
from backend.services.security_util import encrypt
from backend.services.constants import *
from sqlalchemy import or_
import math, random


def get_incorrect_logins(**kwargs):
    inc_login_qs = IncorrectLogins.query.filter_by(**kwargs)
    inc_logins = []

    for record in inc_login_qs:
        record_dict = record.__dict__
        if "_sa_instance_state" in record_dict:
            record_dict.pop("_sa_instance_state")
        inc_logins.append(record_dict)

    return inc_logins


def add_incorrect_logins(**kwargs):
    result = "success"
    try:
        inc_login = IncorrectLogins(**kwargs)
        app.db.session.add(inc_login)
        app.db.session.commit()
    except Exception as e:
        print(e)

        result = "error"

    return result


def update_incorrect_logins(user_email, **kwargs):
    result = "success"
    try:
        keys = kwargs.keys()
        inc_login = app.db.session.query(IncorrectLogins).filter_by(user_email=user_email).first()
        for key in keys:
            exec("inc_login.{0} = kwargs['{0}']".format(key))
        app.db.session.commit()
    except:
        result = "error"
    return result


def get_sign_in_history(**kwargs):
    signin_qs = Signinhistory.query.filter_by(**kwargs)
    signins = []

    for record in signin_qs:
        record_dict = record.__dict__
        if "_sa_instance_state" in record_dict:
            record_dict.pop("_sa_instance_state")
        record_dict['created_time'] = str(record_dict['created_time'])
        signins.append(record_dict)

    return signins

def get_session(**kwargs):
    session_qs = Session.query.filter_by(**kwargs)
    session_last = None
    
    for session in session_qs:
        session_last = session
        # session_qs = session_last
    
    if session_last:
        session_last = session_last.__dict__
        # if "_sa_instance_state" in session_last:
        #     session_last.pop("_sa_instance_state")

    return session_last


def add_session(**kwargs):
    result = "success"
    try:
        session_t = Session(**kwargs)
        app.db.session.add(session_t)
        app.db.session.commit()
    except Exception as e:
        print(e)

        result = "error"

    return result

def add_sign_in(**kwargs):
    result = "success"
    try:
        signin = Signinhistory(**kwargs)
        app.db.session.add(signin)
        app.db.session.commit()
    except Exception as e:
        print(e)

        result = "error"

    return result

def generate_account_number():
    digits = "0123456789"
    account_number = "7" 
    accounts = ['123']
    while len(accounts)!=0:
        for i in range(9) :
            account_number += digits[math.floor(random.random() * 10)]
        accounts = get_customer_bank_accounts(number=account_number, is_active=True)
    return account_number

def get_customer_bank_accounts(**kwargs):
    accounts_qs = Bankaccount.query.filter_by(**kwargs)
    accounts = []

    for record in accounts_qs:
        record_dict = record.__dict__
        if "_sa_instance_state" in record_dict:
            record_dict.pop("_sa_instance_state")
        record_dict['balance'] = str(record_dict['balance'])
        accounts.append(record_dict)

    return accounts


def add_customer_bank_account(**kwargs):
    result = "success"
    try:
        account = Bankaccount(**kwargs)
        app.db.session.add(account)
        app.db.session.commit()
    except Exception as e:
        print(e)

        result = "error"

    return result

def update_customer_bank_account(account_number, **kwargs):
    result = "success"
    try:
        keys = kwargs.keys()
        account = app.db.session.query(Bankaccount).filter_by(number=account_number).first()
        for key in keys:
            exec("account.{0} = kwargs['{0}']".format(key))
        app.db.session.commit()
    except:
        result = "error"
    return { "status": "success", "data": { "data": result }}


def get_admin_every_user():
    profiles_qs = User.query.all()
    profiles = []

    # SQLAlchemy adds an additional field called '_sa_instance_state'
    # jsonify can't serialize this so we are just going to remove it
    for record in profiles_qs:
        record_dict = record.__dict__
        record_dict.pop("_sa_instance_state")
        profiles.append(record_dict)

    return profiles

def get_all_users():
    profiles_qs = User.query.filter(app.db.and_(User.is_active == True, app.db.or_(User.role_id == 1, User.role_id == 2)))
    profiles = []

    # SQLAlchemy adds an additional field called '_sa_instance_state'
    # jsonify can't serialize this so we are just going to remove it
    for record in profiles_qs:
        record_dict = record.__dict__
        record_dict.pop("_sa_instance_state")
        record_dict.pop("password")
        record_dict.pop("ssn")
        profiles.append(record_dict)

    return profiles


def get_all_active_user_requests():
    profiles_qs = User.query.filter(app.db.and_(User.is_active == True, app.db.or_(User.role_id == 1, User.role_id == 2), User.edit_mode == True))
    profiles = []

    # SQLAlchemy adds an additional field called '_sa_instance_state'
    # jsonify can't serialize this so we are just going to remove it
    for record in profiles_qs:
        record_dict = record.__dict__
        record_dict.pop("_sa_instance_state")
        record_dict.pop("password")
        record_dict.pop("ssn")
        # record_dict.pop("")
        profiles.append(record_dict)

    return profiles


def get_all_active_employee_requests():
    profiles_qs = User.query.filter(app.db.and_(User.is_active == True, app.db.or_(User.role_id == 3, User.role_id == 4), User.edit_mode == True))
    profiles = []

    # SQLAlchemy adds an additional field called '_sa_instance_state'
    # jsonify can't serialize this so we are just going to remove it
    for record in profiles_qs:
        record_dict = record.__dict__
        record_dict.pop("_sa_instance_state")
        profiles.append(record_dict)

    return profiles


def get_all_employees():
    profiles_qs = User.query.filter(app.db.and_(User.is_active == True, app.db.or_(User.role_id == 3, User.role_id == 4)))
    profiles = []

    # SQLAlchemy adds an additional field called '_sa_instance_state'
    # jsonify can't serialize this so we are just going to remove it
    for record in profiles_qs:
        record_dict = record.__dict__
        record_dict.pop("_sa_instance_state")
        profiles.append(record_dict)

    return profiles

def get_all_user_bank_accounts():
    profiles_qs = Bankaccount.query.all()
    profiles = []

    # SQLAlchemy adds an additional field called '_sa_instance_state'
    # jsonify can't serialize this so we are just going to remove it
    for record in profiles_qs:
        record_dict = record.__dict__
        record_dict.pop("_sa_instance_state")
        profiles.append(record_dict)

    return profiles

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

        app.db.session.commit()

        result = get_user_account(id=id)
    except:
        result = "error"
    return result


def update_user_account_email_args(email, **kwargs):
    result = "error"
    try:
        keys = kwargs.keys()
        user = app.db.session.query(User).filter_by(email=email).first()

        for key in keys:
            exec("user.{0} = kwargs['{0}']".format(key))

        app.db.session.commit()

        result = get_user_account(email=email)
    except:
        result = "error"
    return result

def update_user_account_email_service(email):
    result = "error"
    try:
        user = app.db.session.query(User).filter_by(email=email).first()
        user.email = email
        app.db.session.commit()

        result = get_user_account(email=email)
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


def post_feedback(**kwargs):
    feedback = Feedback(**kwargs)
    app.db.session.add(feedback)
    app.db.session.commit()
    
    return "success"


def get_all_feedback():
    profiles_qs = Feedback.query.all()
    profiles = []

    # SQLAlchemy adds an additional field called '_sa_instance_state'
    # jsonify can't serialize this so we are just going to remove it
    for record in profiles_qs:
        record_dict = record.__dict__
        record_dict.pop("_sa_instance_state")
        profiles.append(record_dict)

    return profiles



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


