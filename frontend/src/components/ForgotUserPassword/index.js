import React, { Component } from "react";
import "antd/dist/antd.css";
import "./style.css";

import { Input, Button} from "antd";
import { postRequestWithoutToken } from "../../util/api";
import { API_URL } from "../../constants/references";

import { withRouter } from 'react-router-dom'

import { browserHistory } from 'react-router'




const emailRegex = RegExp(
  /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
);

class ForgotUserPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      isOtpGenerated: false,
      otp: "",
      isOtpVerified: false,
      password: "",
      confirm_password: "",
      isUpdated: false,
    };
  }

  componentDidMount() {
    // getRequest(`${API_URL}/user/GetBankAccounts`)
  }

  setComponentSize = () => {
    this.setState({ componentSize: "small" });
  };


  handleEmail = e => {
    this.setState({ email: e.target.value });
  };

  handlePassword = e => {
    this.setState({ password: e.target.value });
  };

  handleConfirmPassword = e => {
    this.setState({ confirm_password: e.target.value });
  };


  handleOtp = e => {
    this.setState({ otp: e.target.value });
  }

  handleAmountChange = value => {
    this.setState({ amount: value });
  };



  validate = () => {
    // do some form validation
    if (
      !this.state.email
    ) {
      alert("Form is Incomplete !!");
      return false;
    }


    var re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    if (re.test(String(this.state.email).toLowerCase()) == false) {
      alert("The email entered is not valid!!")
      return false
    }


    return true;
  };

  validatePassword = () => {
    if (this.state.password.length >= 7 && this.state.confirm_password.length >= 7 && this.state.password === this.state.confirm_password)
    return true;
    else {
      alert('match the passwords...')
      return false;
    }
  }

  onButtonClick = (type) => {
    if (this.validate()) {
      let data = this.state;
      if (type == 'generate') {
        postRequestWithoutToken(`${API_URL}/api/v1/otp/GenerateOTPResetPassword`, {"email": this.state.email})
        .then((data) => {
          console.log(data)
          if (data["status"] === "success")
            this.setState({ isOtpGenerated: true })
          else {
            this.setState({ isOtpGenerated: false })
            alert('Failed. You might have entered an invalid email.')
          }
        })
        .catch((data) => {
          console.log('reached here...')
          this.setState({ isOtpGenerated: false })
          alert('Failed. You might have entered an invalid email.')
        });
      } else if (type == 'verify') {
        postRequestWithoutToken(`${API_URL}/api/v1/otp/VerifyOTPResetPassword`, {"email": this.state.email, "otp": this.state.otp})
        .then(() => {
          // route to appropriate page
          this.setState({ isOtpVerified: true })
        })
        .catch(() => {
          // display error message. not needed for now, we can assume api is stable.
        });
      } else if (type == 'update' && this.validatePassword()) {
        postRequestWithoutToken(`${API_URL}/api/v1/otp/ResetPassword`, {"email": this.state.email, "otp": this.state.otp, "password": this.state.password })
        .then(() => {
          // route to appropriate page
          this.setState({ isUpdated: true })

          this.props.history.goBack()

        })
        .catch(() => {
          // display error message. not needed for now, we can assume api is stable.
        });
      }

    } else {
      // display error message
    }
  };

  render() {
    return (
      <div className="create-form-container">
        Enter your registered email below. We will send you an email with a link to reset your password.

        <Input
          type="email"
          onChange={this.handleEmail}
          value={this.state.email}
          disabled={this.state.isOtpGenerated}
        />
        <br />
        <br />

        <Button disabled={this.state.isOtpGenerated} type="primary" onClick={() => this.onButtonClick('generate')}>
          Send reset email
        </Button>

        { this.state.isOtpGenerated ? 
          <div>
            <Input
              onChange={this.handleOtp}
              value={this.state.otp}
              disabled={this.state.isOtpVerified}
            />
            <Button disabled={this.state.isOtpVerified} type="primary" onClick={() => this.onButtonClick('verify')}>
              Verify OTP
            </Button>
          </div> : ''
        }

        { this.state.isOtpVerified ?
          <div>
            Password: <br></br> <br></br>
            <Input
              type="password"
              onChange={this.handlePassword}
              value={this.state.password}
            />

            <br></br>
            Confirm Password: <br></br> <br></br>
            <Input
              type="password"
              onChange={this.handleConfirmPassword}
              value={this.state.confirmPassword}
            />

            <Button type="primary" onClick={() => this.onButtonClick('update')}>
              Update Information
            </Button>
        </div> : ''
        }
      </div>
    );
  }
}

export default withRouter(ForgotUserPassword);