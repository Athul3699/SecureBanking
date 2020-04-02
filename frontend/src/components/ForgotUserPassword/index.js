import React, { Component } from "react";
import "antd/dist/antd.css";
import "./style.css";

import { Input, Button} from "antd";
import { postRequestWithoutToken } from "../../util/api";
import { API_URL } from "../../constants/references";






const emailRegex = RegExp(
  /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
);

class ForgotUserPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {

      email: "",
      role_id: 1
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


    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(this.state.email)) {
      alert("The email entered is not valid!!");
      return false;
    }


    return true;
  };

  onButtonClick = () => {
    if (this.validate()) {
      let data = this.state;
      delete data["confirm_password"];
      postRequestWithoutToken(`${API_URL}/api/v1/auth/RegisterUser`, this.state)
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

        <Button type="primary" onClick={this.onButtonClick}>
          Send reset email
        </Button>
      </div>
    );
  }
}

export default ForgotUserPassword;