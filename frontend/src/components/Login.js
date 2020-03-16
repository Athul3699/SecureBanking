
import React, { Component } from "react";
import './Login.css';



class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userID: null,
      password: null,
      formErrors: {
        userID: "",
        password: ""
      }
    };
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
            href="#forgotIDorPWD"
            rel="noopener noreferrer"
          >
            Forgot user ID/password?
          </a>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <a
            href="#createAccount"
            rel="noopener noreferrer"
          >
            Create account
          </a>
        </p>
        <input type="submit" value="Sign In"/>
      </div>
    </div>
  );
}
}
export default Login;
