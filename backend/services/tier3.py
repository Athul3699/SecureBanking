from backend import app
from backend.model.manage import Authorizedrole, Maintenancelog, User, Bankaccount, Signinhistory, Transaction, Appointment
from securebankingsystem import backend


def add_record_to_maintenance_log(**kwargs):
    record = Maintenancelog(**kwargs)
    app.db.session.add(record)
    app.db.session.commit()


def get_maintenance_log(page=0, page_size=None):
    logs_qs = Maintenancelog.query.all()

    if page_size:
        logs_qs = logs_qs.limit(page_size)
    if page:
        logs_qs = logs_qs.offset(page * page_size)

    logs = []
    for record in logs_qs:
        logs.append(record.__dict__)
    return logs

