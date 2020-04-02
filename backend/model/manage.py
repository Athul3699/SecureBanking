from ..services.constants import *
from flask_sqlalchemy import SQLAlchemy
from flask import Flask
from flask_script import Manager
from flask_migrate import Migrate, MigrateCommand
import datetime
from sqlalchemy.types import JSON
import jwt

import sys
sys.path.append("..") # Adds higher directory to python modules path.

app = Flask(__name__)
# app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:t@localhost:5432/securebank'
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///securebank'

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
migrate = Migrate(app, db)
manager = Manager(app)
manager.add_command('db', MigrateCommand)


class Authorizedrole(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    role_name = db.Column(db.String, nullable=False)
    view_customer_account = db.Column(db.Boolean, default=False, nullable=False)
    view_all_customer_accounts = db.Column(db.Boolean, default=False, nullable=False)
    view_merchant_account = db.Column(db.Boolean, default=False, nullable=False)
    create_customer_account = db.Column(db.Boolean, default=False, nullable=False)
    delete_customer_account = db.Column(db.Boolean, default=False, nullable=False)
    modify_customer_account = db.Column(db.Boolean, default=False, nullable=False)
    view_employee_account = db.Column(db.Boolean, default=False, nullable=False)
    create_employee_account = db.Column(db.Boolean, default=False, nullable=False)
    delete_employee_account = db.Column(db.Boolean, default=False, nullable=False)
    modify_employee_account = db.Column(db.Boolean, default=False, nullable=False)
    view_customer_request = db.Column(db.Boolean, default=False, nullable=False)
    approve_employee_request = db.Column(db.Boolean, default=False, nullable=False)
    decline_employee_request = db.Column(db.Boolean, default=False, nullable=False)
    approve_customer_request_critical = db.Column(db.Boolean, default=False, nullable=False)
    approve_customer_request_noncritical = db.Column(db.Boolean, default=False, nullable=False)
    decline_customer_request_critical = db.Column(db.Boolean, default=False, nullable=False)
    decline_customer_request_noncritical = db.Column(db.Boolean, default=False, nullable=False)
    issue_cashier_checks = db.Column(db.Boolean, default=False, nullable=False)
    initiate_creation_additional_customer_account = db.Column(db.Boolean, default=False, nullable=False)
    approve_creation_additional_customer_account = db.Column(db.Boolean, default=False, nullable=False)
    initiate_modification_customer_account = db.Column(db.Boolean, default=False, nullable=False)
    initiate_modification_personal_account = db.Column(db.Boolean, default=False, nullable=False)
    initiate_money_transfer = db.Column(db.Boolean, default=False, nullable=False)
    initiate_debit_request = db.Column(db.Boolean, default=False, nullable=False)
    initiate_credit_request = db.Column(db.Boolean, default=False, nullable=False)
    approve_customer_request_by_merchant = db.Column(db.Boolean, default=False, nullable=False)
    decline_customer_request_by_merchant = db.Column(db.Boolean, default=False, nullable=False)
    technical_account_access = db.Column(db.Boolean, default=False, nullable=False)
    created_date = db.Column(db.DateTime, default=datetime.datetime.utcnow())


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String, default='')
    last_name = db.Column(db.String, default='')
    email = db.Column(db.String, unique=True, nullable=False)
    password = db.Column(db.String, nullable=False)
    date_of_birth = db.Column(db.DateTime, nullable=False)
    ssn = db.Column(db.String, nullable=False)
    address1 = db.Column(db.String, default='')
    address2 = db.Column(db.String, default='')
    contact = db.Column(db.String, nullable=False)
    role_id = db.Column(db.Integer, db.ForeignKey('authorizedrole.id'), nullable=False)
    created_date = db.Column(db.DateTime, default=datetime.datetime.utcnow())
    edit_status = db.Column(db.Integer, default=APPROVED)
    edit_data = db.Column(JSON, default={})
    edit_mode = db.Column(db.Boolean, default=False)
    is_active = db.Column(db.Boolean, default=True)
    activeJWT = db.Column(db.String, default='')

    def encode_auth_token(self, email):
        try:
            payload = {
                'exp': datetime.datetime.utcnow() + datetime.timedelta(seconds=1200),
                'email': email
            }
            
            return jwt.encode(
                payload,
                "justatest",
                algorithm='HS256'
            )
        except Exception as e:
            return e

    @staticmethod
    def decode_auth_token(auth_token):
        """
        Validates the auth token
        :param auth_token:
        :return: integer|string
        """
        try:
            payload = jwt.decode(auth_token, "justatest")
            is_blacklisted_token = BlacklistToken.check_blacklist(auth_token)
            if is_blacklisted_token:
                raise ValueError('Token blacklisted. Please log in again.')
            else:
                return payload['email']
        except jwt.ExpiredSignatureError:
            raise ValueError('Signature expired. Please log in again.')
        except jwt.InvalidTokenError:
            raise ValueError('Invalid token. Please log in again.')


class BlacklistToken(db.Model):
    """
    Token Model for storing JWT tokens
    """
    __tablename__ = 'blacklist_tokens'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    token = db.Column(db.String(500), unique=True, nullable=False)
    blacklisted_on = db.Column(db.DateTime, nullable=False)

    def __init__(self, token):
        self.token = token
        self.blacklisted_on = datetime.datetime.now()

    def __repr__(self):
        return '<id: token: {}'.format(self.token)

    @staticmethod
    def check_blacklist(auth_token):
        # check whether auth token has been blacklisted
        res = BlacklistToken.query.filter_by(token=str(auth_token)).first()
        if res:
            return True
        else:
            return False


class Bankaccount(db.Model):
    number = db.Column(db.String, primary_key=True)
    type = db.Column(db.String, nullable=False)
    routing_number = db.Column(db.String, nullable=False)
    balance = db.Column(db.Numeric, default=0, nullable=False)
    created_date = db.Column(db.DateTime, default=datetime.datetime.utcnow())
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    is_active = db.Column(db.Boolean, default=False)


class Maintenancelog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    accessed_by = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    last_access_time = db.Column(db.DateTime, nullable=False)
    created_date = db.Column(db.DateTime, default=datetime.datetime.utcnow())
    is_active = db.Column(db.Boolean, default=True)


class Signinhistory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    login_time = db.Column(db.DateTime, default= datetime.datetime.utcnow())
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    logout_time = db.Column(db.DateTime, default= datetime.datetime.utcnow())
    logout_reason = db.Column(db.String, nullable=False, default= 'User Initiated')
    created_date = db.Column(db.DateTime, default=datetime.datetime.utcnow())
    is_active = db.Column(db.Boolean, default=True)


class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String, nullable=False)
    from_account = db.Column(db.String, db.ForeignKey('bankaccount.number'), nullable=True)
    to_account = db.Column(db.String, db.ForeignKey('bankaccount.number'), nullable=True)
    amount = db.Column(db.Numeric,nullable=False)
    status = db.Column(db.String, nullable=False) # submitted, approved, declined
    is_critical = db.Column(db.Boolean, default=False, nullable=False)
    description = db.Column(db.String, default='', nullable=False)
    message = db.Column(db.String, default='', nullable=False)
    created_date = db.Column(db.DateTime, default=datetime.datetime.utcnow())

    # last_approved_by = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    # last_approved_time = db.Column(db.DateTime,nullable=False)
    # is_active = db.Column(db.Boolean, default=True, nullable=False)


class Appointment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    schedule = db.Column(db.DateTime, nullable=False)
    reason = db.Column(db.DateTime, nullable=False)
    created_date = db.Column(db.DateTime, default=datetime.datetime.utcnow())
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    is_active = db.Column(db.Boolean, default=True)


if __name__ == '__main__':
    manager.run()

