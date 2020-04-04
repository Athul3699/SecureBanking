from backend import app
from backend.model.manage import Appointment
import datetime

def schedule_appointment(**kwargs):
    kwargs["date"] = datetime.datetime.strptime(kwargs["date"], '%Y/%m/%d')
    try:
        record = Appointment(**kwargs)
        app.db.session.add(record)
        app.db.session.commit()
    except Exception as e:
        print(e)
        return "error"

    return "success"


def get_appointments():
    today = datetime.date.today()

    appointments = []

    for i in range(6):
        day = today + datetime.timedelta(days=i)

        day_appointments = app.db.session.query(Appointment).filter_by(date=day).all()
        for appointment in day_appointments:
            appointment = appointment.__dict__
            if "_sa_instance_state" in appointment:
                appointment.pop("_sa_instance_state")
            appointments.append(appointment)

    return appointments
