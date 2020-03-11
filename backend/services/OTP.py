from flask import Flask, session, send_file
import six
import qrcode
import pyotp
from flask import current_app
import math, random

if six.PY2:
    from StringIO import StringIO as BytesIO
else:
    from io import BytesIO

app.config["SECRET_KEY"] = "something"
app.config["DOMAIN"] = "www.XXX.com"
app = Flask(__name__)

class OTP:
    def get_key():
        digits = "0123456789"
        OTP = "" 
      
       # length of password can be chaged by changing value in range 
        for i in range(4) : 
            OTP += digits[math.floor(random.random() * 10)] 
      
        return OTP 

    def qr(key):
        t = pyotp.TOTP(key)
        uri = t.provisioning_uri(current_app.config["DOMAIN"] or "")
        q = qrcode.make(uri)
        img = BytesIO()
        q.save(img, 'PNG')
        img.seek(0)
        return img


otp = OTP()


@app.route('/qr')
def qr():
    """
    Return a QR code for the secret key
    The QR code is returned as file with MIME type image/png.
    """
    if session.get("OTPKEY", True):
        # returns a 16 character base32 secret.
        # Compatible with Google Authenticator
        session["OTPKEY"] = otp.get_key()
    img = otp.qr(session["OTPKEY"])
    return send_file(img, mimetype="image/png")


@app.route('/verify/<string:password>')
def verify(password):
    """
    verify the One-Time Password
    """
    return str(session["OTPKEY"] == str(password))


if __name__ == '__main__':
    app.run()