import React, { Component } from 'react';
import './Login.css';
import { postRequest } from './util/api';
import { API_URL } from './constants/references';
import { Button } from 'antd';

class Login extends Component {

  constructor(props) {
    super(props)

    this.state = {
      email: '',
      password: '',
    }
  }

  onSignInButtonClick = () => {
    postRequest(`${API_URL}/api/v1/auth/LoginUser`, { "email": this.state.email, "password": this.state.password })
    .then((data) => {
      console.log(data)
      window.localStorage.setItem('API_TOKEN', data["data"])
    })
    .catch((error) => console.log(error))
  }

  onEmailChange = (e) => {
    this.setState({ email: e.target.value })
  }

  onPasswordChange = (e) => {
    this.setState({ password: e.target.value })
  }

  render() {
    return (
      <div className="Login">
        <header className="Login-header">
        </header>
        <div className="Prompt-box">
          <h2 className="Prompt-header">Log in <i class="material-icons"></i></h2>
          <p className="Prompt-textinput">
            <label for="userID">&nbsp;&nbsp;&nbsp;Email&nbsp;&nbsp;</label>
            <input type="text" id="userID" name="userID" onChange={this.onEmailChange}/>
          </p>
          <p className="Prompt-textinput">
            <label for="password">Password&nbsp;&nbsp;</label>
            <input type="text" id="password" name="password" onChange={this.onPasswordChange}/>
          </p>
            
            
          <p className="Login-link">
            <a
              href="/forgotuserpassword"
              rel="noopener noreferrer"
            >
              Forgot user password?
            </a>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <a
              href="/createuseraccount"
              rel="noopener noreferrer"
            >
              Create account
            </a>
          </p>
          <Button onClick={this.onSignInButtonClick}>
            Sign In
          </Button>
        </div>
      </div>
    );
  }

}

export default Login;
