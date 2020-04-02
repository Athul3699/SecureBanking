from flask import Flask, session, render_template, request
from OTP import OTP
from database import db

app = Flask(__name__)
app.config['SECRET_KEY'] = '$$group10'
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:Pratima@77@localhost/postgres'


my_dict = {}
d = db()
keys = d.get_users()
passwords = d.get_passwords()
for i, key in enumerate(keys):
    my_dict[key] = passwords[i]

@app.route('/reset', methods=["POST", "GET"])
def reset():

    if request.method == "POST":
        otp = request.form["o"]
        new_pwd = request.form["new"]
        conf_pwd = request.form["new_f"]

        if otp == session["OTPKEY"]:
            if new_pwd == conf_pwd:
                d.update_password(conf_pwd, mailid)
                return "Your password is changed"
            else:
                return "Passwords don't match"
        else:
            return "OTP is incorrect"
    else:
        return render_template("login2.html")

@app.route('/login', methods=["POST", "GET"])
def login():
    global mailid

    if request.method == "POST":
        mailid = request.form["mail"]
        if mailid in my_dict:
            op = OTP()
            session["OTPKEY"] = op.get_key()
            op.send_email("Verify OTP", mailid, session["OTPKEY"])
            return "OTP is sent to your mailid. Please reset your password"
        else:
            return "wrong user_id"
    else:
        return render_template("otp.html")



if __name__ == "__main__":
    app.run(debug=True)