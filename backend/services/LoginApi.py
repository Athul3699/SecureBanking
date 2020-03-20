from flask import Flask, jsonify, request, make_response
import jwt
import datetime
from functools import wraps
from sec import token_required, encrypt, check_decrypt


app= Flask(__name__)

app.config['SECRET_KEY'] = '$$group10'
   

flag_dict = {}
	
user= ['username']
for key in user:
    flag_dict[key]={}
    flag_dict[key]['flag_count']=0
    flag_dict[key]['expires_at']= datetime.datetime.min


#API to login with limited attempts for wrong password (4 attempts)
@app.route('/login')
def login():
    auth = request.authorization
    if not auth or not auth.username or not auth.password:
        return make_response('Could not verify', 401, {'WWW-Authenticate' : 'Basic realm="Login required!"'})
    
    #These 2 lines should be added to function to register user in the DB.
    pwd_hashed = encrypt("password")
    user_hashed = encrypt("username")


    global flag_dict
    if auth:
        if check_decrypt(user_hashed, auth.username):
            if check_decrypt(pwd_hashed, auth.password):
                token = jwt.encode({'user': auth.username, 'exp' : datetime.datetime.utcnow()+ datetime.timedelta(seconds=40)}, app.config['SECRET_KEY'])
                return jsonify({'token' : token.decode('UTF-8')})

            else:
                cur_time= datetime.datetime.utcnow()
                if flag_dict[auth.username]['flag_count']==0:
                    expire_time= cur_time+datetime.timedelta(seconds=40)
                    flag_dict[auth.username]['expires_at']= expire_time
           
                if datetime.datetime.utcnow() < flag_dict[auth.username]['expires_at']:
                    while flag_dict[auth.username]['flag_count']<3:
                        flag_dict[auth.username]['flag_count'] +=1
                        return make_response(jsonify({'message' : 'Incorrect password'}), 401, {'WWW-Authenticate': 'Basic realm= "Login Required"'})
                    else:
                        return jsonify({'message' : 'Email sent!'})

                else: 
                    flag_dict[auth.username]['flag_count'] =0
                    return make_response(jsonify({'message' : 'Incorrect password'}), 401, {'WWW-Authenticate': 'Basic realm= "Login Required"'})
                
        else: 
            return make_response(jsonify({'message' : 'Incorrect username'}), 401, {'WWW-Authenticate': 'Basic realm= "Login Required"'})       
            

        

if __name__== '__main__':
    app.run(debug=True)
