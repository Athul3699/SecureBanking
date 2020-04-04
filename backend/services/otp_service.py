import math, random
import smtplib
from backend.services.common import *
from backend.model.manage import User
from datetime import datetime, timedelta
from backend import app

EMAIL_ADDRESS = "securebankb21@gmail.com"
PASSWORD = "securebank123."

def get_key():
    digits = "0123456789"
    OTP = "" 
    # length of password can be chaged by changing value in range 
    for i in range(6) :
        OTP += digits[math.floor(random.random() * 10)]
    return OTP


def send_email(subject, body, destination_address):
    try:
        server = smtplib.SMTP('smtp.gmail.com:587')
        server.ehlo()
        server.starttls()
        server.ehlo()
        server.login("securebankb21@gmail.com", "securebank123.")
        # server.login(EMAIL_ADDRESS, PASSWORD)
        message = 'Subject: {}\n\n{}'.format(subject, body)
        server.sendmail(EMAIL_ADDRESS, destination_address, message)
        server.quit()
        return "success"

    except Exception as e:
        print(e)

        return "failure"


def generate_otp(email):
    user = app.db.session.query(User).filter_by(email=email).first()

    if user == None:
        return None, "failure"

    otp = get_key()
    user.active_otp = otp
    user.otp_active_till = datetime.now() + timedelta(minutes=5)

    app.db.session.add(user)
    app.db.session.commit()
    
    message = send_email("OTP: please enter in prompt on application", "Your OTP is " + otp, destination_address=email)

    return otp, message


def verify_otp(email, otp):
    user = User.query.filter_by(email=email, otp=otp).first()

    if user == None:
        return "failure"
    else:
        if datetime.now() <= user.otp_active_till:
            return "success"
        else:
            return "failure"