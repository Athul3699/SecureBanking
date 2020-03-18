from backend import app
from backend.model.manage import Appointment


def schedule_appointment(**kwargs):
    record = Appointment(**kwargs)
    app.db.session.add(record)
    app.db.session.commit()

    return "success"

