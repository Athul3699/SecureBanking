from securebankingsystem.backend.model.manage import Authorizedrole, Maintenancelog, User, Bankaccount, Signinhistory, Transaction, Appointment
from securebankingsystem import backend
from securebankingsystem.backend.services.constants import *

def get_customer_bank_accounts(**kwargs):
    accounts_qs = Bankaccount.query.filter_by(**kwargs)
    accounts = []
    for record in accounts_qs:
        accounts.append(record.__dict__)
    return accounts


def add_customer_bank_account(**kwargs):
    account = Bankaccount(**kwargs)
    backend.db.session.add(account)
    backend.db.session.commit()


def update_customer_bank_account(account_number, **kwargs):
    result = "success"
    try:
        keys = kwargs.keys()
        account = Bankaccount.query.filter_by(number=account_number).first()
        for key in keys:
            exec("account.{0} = kwargs['{0}']".format(key))
        backend.db.session.commit()
    except:
        result = "error"
    return result


def get_user_account(**kwargs):
    profiles_qs = User.query.filter_by(**kwargs)
    profiles = []
    for record in profiles_qs:
        profiles.append(record.__dict__)
    return profiles


def add_user_account(**kwargs):
    account = User(**kwargs)
    backend.db.session.add(account)
    backend.db.session.commit()


def add_roles():
    result = "success"
    if backend.db.session.query(Authorizedrole).count()==5:
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
            backend.db.session.add(individual_obj)

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
            backend.db.session.add(merchant_obj)

            tier1_obj = Authorizedrole(
                role_name=TIER1,
                view_all_customer_accounts=True,
                view_customer_request=True,
                approve_customer_request_noncritical=True,
                decline_customer_request_noncritical=True,
                issue_cashier_checks=True
            )
            backend.db.session.add(tier1_obj)

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
            backend.db.session.add(tier2_obj)

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
            backend.db.session.add(tier3_obj)
            backend.db.session.commit()
        except Exception as e:
            print(e)
            result = "error"

    return result


