import React, { Component } from 'react';
import './Login.css';
import { postRequest } from './util/api';
import { API_URL } from './constants/references';
import { Button } from 'antd';

import { withRouter } from "react-router-dom"

class Login extends Component {

  constructor(props) {
    super(props)

    this.state = {
      email: '',
      password: '',
    }
  }

  componentDidMount() {
    this.setState({ email: '', password: '' })
  }

  validate = () => {
    var re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    if (re.test(String(this.state.email).toLowerCase()) == false) {
      alert("The email entered is not valid!!")
      return false
    }

    return true;
  }
  
  onSignInButtonClick = () => {
    if (this.validate()) {
      postRequest(`${API_URL}/api/v1/auth/LoginUser`, { "email": this.state.email, "password": this.state.password })
      .then((data) => {
        console.log(data)
        window.localStorage.setItem('API_TOKEN', data["data"])
        this.props.history.push('/landingPage')
      })
      .catch((error) => { 
        alert('Invalid input... Clear email and password and try again... ')
        this.setState({ email: '', password: '' })
      })
    } else {
      alert('Please enter a valid email...')
    }
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
            <input type="password" id="password" name="password" onChange={this.onPasswordChange}/>
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

export default withRouter(Login);