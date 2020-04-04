import React, { Component } from "react";
import "antd/dist/antd.css";
import "./style.css";

import { Input, Button} from "antd";
import { postRequestWithoutToken } from "../../util/api";
import { API_URL } from "../../constants/references";

import { withRouter } from 'react-router-dom'




const emailRegex = RegExp(
  /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
);

class ForgotUserPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
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

  onButtonClick = () => {
    if (this.validate()) {
      let data = this.state;
      postRequestWithoutToken(`${API_URL}/api/v1/otp/GenerateOTP`, this.state)
        .then(() => {
          // route to appropriate page
        })
        .catch(() => {
          // display error message. not needed for now, we can assume api is stable.
        });
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
        />
        <br />
        <br />

        <Button type="primary" onClick={() => this.onButtonClick()}>
          Send reset email
        </Button>
      </div>
    );
  }
}

export default withRouter(ForgotUserPassword);