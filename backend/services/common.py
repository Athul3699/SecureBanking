from securebankingsystem.backend.model.manage import Authorizedrole, Maintenancelog, User, Bankaccount, Signinhistory, Transaction, Appointment
from securebankingsystem import backend


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



