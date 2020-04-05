from flask import Flask, session, send_file
import math, random
import smtplib


app = Flask(__name__)
app.config["SECRET_KEY"] = "something"
EMAIL_ADDRESS = "arijit1007@gmail.com"
PASSWORD = "Pratima@11"

class OTP:
    def get_key(self):
        digits = "0123456789"
        OTP = "" 

       # length of password can be chaged by changing value in range 
        for i in range(6) :
            OTP += digits[math.floor(random.random() * 10)]
        return OTP

    def send_email(self, subject, mailid, msg):
        try:
            server = smtplib.SMTP('smtp.gmail.com:587')
            server.ehlo()
            server.starttls()
            server.login(EMAIL_ADDRESS, PASSWORD)
            message = 'Subject: {}\n\n{}'.format(subject, msg)
            server.sendmail(EMAIL_ADDRESS, mailid, message)
            server.quit()
            return "Success: OTP sent to registered email"
        except:
            return "Email failed to send."

otp = OTP()


@app.route('/send')
def send():
    session["OTPKEY"] = otp.get_key()
    return otp.send_email("Verify OTP", "rajpanda988@gmail.com", session["OTPKEY"])


@app.route('/verify/<string:password>')
def verify(password):
    """
    verify the One-Time Password
    """
    if str(session["OTPKEY"]) == str(password):
    	return str("True")
    else:
    	return str("False")



if __name__ == '__main__':
    app.run()