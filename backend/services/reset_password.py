from flask import Flask, session, render_template, request
from OTP import OTP
from database import db

app = Flask(__name__)
app.config['SECRET_KEY'] = '$$group10'
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:Pratima@77@localhost/postgres'

flag = True
my_dict = {}
d = db()
keys = d.get_users()
passwords = d.get_passwords()
for i, key in enumerate(keys):
    my_dict[key] = passwords[i]

@app.route("/login/<int:user_id>", methods=["POST", "GET"])
def login(user_id):
    global flag
    if user_id not in my_dict:
        return "No user available on this id"
    if flag:
        op = OTP()
        session["OTPKEY"] = op.get_key()
        op.send_email("Verify OTP", "rajpanda988@gmail.com", session["OTPKEY"])
        flag = False
    if request.method == "POST":
        curr_pwd = request.form["cr"]
        otp = request.form["o"]
        new_pwd = request.form["new"]
        conf_pwd = request.form["new_f"]

        if curr_pwd == my_dict[user_id]:
            if otp == session["OTPKEY"]:
                if new_pwd == conf_pwd:
                    my_dict[user_id] = conf_pwd
                    d.update_password(conf_pwd, user_id)
                    return "Your password is changed"
                else:
                    return "Passwords don't match"
            else:
                return "OTP is incorrect"
        else:
            return "Please enter correct password"
    else:
        return render_template("login.html")

if __name__ == "__main__":
    app.run(debug=True)