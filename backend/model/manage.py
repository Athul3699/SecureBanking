from flask_sqlalchemy import SQLAlchemy
from flask import Flask
from flask_script import Manager
from flask_migrate import Migrate, MigrateCommand
import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///securebank'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
migrate = Migrate(app, db)

manager = Manager(app)
manager.add_command('db', MigrateCommand)

class Authorizedrole(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    created_date = db.Column(db.DateTime, default=datetime.datetime.utcnow())
    users = db.relationship("User", backref="AuthorizedRole",order_by="User.id")

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String, default='')
    last_name = db.Column(db.String, default='')
    date_of_birth = db.Column(db.DateTime, nullable=False)
    ssn = db.Column(db.String, nullable=False)
    created_date = db.Column(db.DateTime, default=datetime.datetime.utcnow())
    role_id = db.Column(db.Integer, db.ForeignKey('authorizedrole.id'), nullable=False)
    role = db.relationship("Authorizedrole", backref= db.backref('users', lazy=True))

class Bankaccount(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    number = db.Column(db.String, nullable=False)
    type = db.Column(db.String, nullable=False)
    routing_number = db.Column(db.String, nullable=False)
    balance = db.Column(db.Numeric, default=0)
    created_date = db.Column(db.DateTime, default=datetime.datetime.utcnow())
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user = db.relationship("User", backref= db.backref('accounts', lazy=True))

class Maintenancelog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    accessed_by = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user = db.relationship("User", backref= db.backref('logs', lazy=True))
    last_access_time = db.Column(db.DateTime, nullable=False)
    created_date = db.Column(db.DateTime, default=datetime.datetime.utcnow())

class Signinhistory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    login_time = db.Column(db.DateTime, default= datetime.datetime.utcnow())
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user = db.relationship("User", backref=db.backref('signins', lazy=True))
    logout_time = db.Column(db.DateTime, default= datetime.datetime.utcnow())
    logout_reason = db.Column(db.String, nullable=False, default= 'User Initiated')
    created_date = db.Column(db.DateTime, default=datetime.datetime.utcnow())

class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    initiated_time = db.Column(db.DateTime, default= datetime.datetime.utcnow())
    type = db.Column(db.String, nullable=False)
    initiated_by = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user = db.relationship("User", backref=db.backref('accounts', lazy=True))
    from_account = db.Column(db.Integer, db.ForeignKey('bankaccount.id'), nullable=True)
    to_account = db.Column(db.Integer, db.ForeignKey('bankaccount.id'), nullable=True)
    bankaccount = db.relationship("Bankaccount", backref=db.backref('transactions', lazy=True))
    amount = db.Column(db.Numeric,nullable=False)
    status = db.Column(db.String, nullable=False)
    created_date = db.Column(db.DateTime, default=datetime.datetime.utcnow())

class Appointment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    schedule = db.Column(db.DateTime, nullable=False)
    reason = db.Column(db.DateTime, nullable=False)
    created_date = db.Column(db.DateTime, default=datetime.datetime.utcnow())
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user = db.relationship("User", backref=db.backref('appointments', lazy=True))

if __name__ == '__main__':
    manager.run()
