import React, { Component } from 'react';
import './Login.css';
import { postRequest } from './util/api';
import { API_URL } from './constants/references';

class Login extends Component {

  constructor(props) {
    super(props)

    this.state = {
      email: 'a@a.com',
      password: 'a',
    }
  }

  onSignInButtonClick = () => {
    postRequest(`${API_URL}/api/v1/auth/login_user`, { "email" : this.state.email, "password": this.state.password })
    .then((data) => {
      console.log(data)
      window.localStorage.setItem('API_TOKEN', data["token"])
    })
    .catch((error) => console.log(error))
  }

  render() {
    return (
      <div className="Login">
        <header className="Login-header">
        </header>
        <div className="Prompt-box">
          <h2 className="Prompt-header">Secure Account Log In <i class="material-icons"> lock</i></h2>
          <p className="Prompt-textinput">
            <label for="userID">&nbsp;&nbsp;&nbsp;User ID&nbsp;&nbsp;</label>
            <input type="text" id="userID" name="userID"/>
          </p>
          <p className="Prompt-textinput">
            <label for="password">Password&nbsp;&nbsp;</label>
            <input type="text" id="password" name="password"/>
          </p>
            
            
          <p className="Login-link">
            <a
              href="https://reactjs.org"
              rel="noopener noreferrer"
            >
              Forgot user ID/password?
            </a>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <a
              href="/register"
              rel="noopener noreferrer"
            >
              Create account
            </a>
          </p>
          <button onClick={this.onSignInButtonClick} value="Sign In"/>
        </div>
      </div>
    );
  }

}

export default Login;
