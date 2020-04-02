import React, { Component } from "react";
import "antd/dist/antd.css";
import "./style.css";

import { Input, Button, Radio, Select, InputNumber, DatePicker } from "antd";
import { postRequestWithoutToken } from "../../util/api";
import { API_URL } from "../../constants/references";

function formatNumber(value) {
  value += "";
  const list = value.split(".");
  const prefix = list[0].charAt(0) === "-" ? "-" : "";
  let num = prefix ? list[0].slice(1) : list[0];
  let result = "";
  while (num.length > 3) {
    result = `,${num.slice(-3)}${result}`;
    num = num.slice(0, num.length - 3);
  }
  if (num) {
    result = num + result;
  }
  return `${prefix}${result}${list[1] ? `.${list[1]}` : ""}`;
}

const { TextArea } = Input;
const { Option } = Select;

const dateFormat = "YYYY/MM/DD";

const emailRegex = RegExp(
  /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
);

class ResetUserPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      role_id: 1,
      password: "",
      confirm_password: ""
    };
  }

  componentDidMount() {
    // getRequest(`${API_URL}/user/GetBankAccounts`)
  }

  setComponentSize = () => {
    this.setState({ componentSize: "small" });
  };

  handlePassword = e => {
    this.setState({ address: e.target.value });
  };

  handleAmountChange = value => {
    this.setState({ amount: value });
  };

  handlePassword = e => {
    this.setState({ password: e.target.value });
  };

  handleConfirmPassword = e => {
    this.setState({ confirm_password: e.target.value });
  };


  validate = () => {
    // do some form validation
    if (
      !this.state.password
    ) {
      alert("Form is Incomplete !!");
      return false;
    }

    if (this.state.password.length < 7) {
      alert("The password should contain minimum 7 characters");
      return false;
    }

    var re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    if (re.test(String(this.state.email).toLowerCase()) == false) {
      alert("The email entered is not valid!!")
      return false
    }

    if (this.state.password != this.state.confirm_password) {
      alert("Passwords are not matching");
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

        New Password: <br />
        <Input
          type="password"
          onChange={this.handlePassword}
          value={this.state.password}
        />
        <br />
        <br />
        Confirm New Password: <br />
        <Input
          type="password"
          onChange={this.handleConfirmPassword}
          value={this.state.confirm_password}
        />
        <br />
        <br />
        <Button type="primary" onClick={this.onButtonClick}>
          Reset
        </Button>
      </div>
    );
  }
}

export default ResetUserPassword;