from backend import app
from backend.model.manage import Appointment


def schedule_appointment(**kwargs):
    try:
        record = Appointment(**kwargs)
        app.db.session.add(record)
        app.db.session.commit()
    except Exception as e:
        return "error"

    return "success"

