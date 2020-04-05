import React, { Component } from "react";
import "antd/dist/antd.css";
import "./style.css";

import { Input, Button, Radio, Select, InputNumber, DatePicker } from "antd";
import { postRequestWithoutToken } from "../../util/api";
import { API_URL } from "../../constants/references";

import { withRouter } from "react-router-dom";

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

class CreateUserAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      first_name: "",
      last_name: "",
      email: "",
      role_id: 1,
      password: "",
      date_of_birth: "",
      ssn: "",
      address1: "",
      contact: "",
      confirm_password: "",
      date_of_birth: ""
    };
  }

  componentDidMount() {
    // getRequest(`${API_URL}/user/GetBankAccounts`)
  }

  setComponentSize = () => {
    this.setState({ componentSize: "small" });
  };

  handleFirstName = e => {
    this.setState({ first_name: e.target.value });
  };

  handleLastName = e => {
    this.setState({ last_name: e.target.value });
  };

  handleEmail = e => {
    this.setState({ email: e.target.value });
  };

  handleContact = e => {
    this.setState({ contact: e.target.value });
  };

  handleAccountType = e => {
    this.setState({ role_id: e.target.value });
  };

  handleAddress = e => {
    this.setState({ address1: e.target.value });
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

  handleDobChange = (v1, v2) => {
    console.log(v1, v2);
    this.setState({ date_of_birth: v2 });
  };

  handleSsnChange = e => {
    this.setState({ ssn: e.target.value });
  };

  validate = () => {
    // do some form validation
    if (
      !this.state.first_name ||
      !this.state.last_name ||
      !this.state.password ||
      !this.state.ssn ||
      !this.state.date_of_birth ||
      !this.state.contact ||
      !this.state.date_of_birth
    ) {
      alert("Form is Incomplete !!");
      return false;
    }
    if (this.state.first_name.length < 3) {
      alert("Name should contain at least 3 characters ");
      return false;
    }
    if (this.state.last_name.length < 3) {
      alert("Last name should contain at least 3 characters");
      return false;
    }
    if (this.state.ssn.length !== 10) {
      alert("The SSN should be a 10 digit number");
      return false;
    }

    if (this.state.contact.length < 10) {
      alert("The contact number should be 10 digits");
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
      console.log("Coming here...")
      let data = this.state;
      let confirm_password = data['confirm_password']
      delete data["confirm_password"];
      postRequestWithoutToken(`${API_URL}/api/v1/auth/RegisterUser`, this.state)
        .then((data) => {
          // route to appropriate page
          window.localStorage.setItem('API_TOKEN', data["data"])
          this.props.history.push('/landingPage')
        })
        .catch(() => {
          // display error message. not needed for now, we can assume api is stable.
          this.setState({ confirm_password })
        });
    } else {
      // display error message
    }
  };

  render() {
    return (
      <div className="create-form-container">
        First Name:
        <br />
        <Input
          // parser={value => value.replace(/\$\s?|(,*)/g, '')}
          onChange={this.handleFirstName}
          value={this.state.first_name}
        />
        <br />
        <br />
        Last Name:
        <br />
        <Input onChange={this.handleLastName} value={this.state.last_name} />
        <br />
        <br />
        Email: <br />
        <Input
          type="email"
          onChange={this.handleEmail}
          value={this.state.email}
        />
        <br />
        <br />
        Contact Number:
        <br />
        <Input onChange={this.handleContact} value={this.state.contact} />
        <br />
        <br />
        Date of Birth: <br />
        <DatePicker format={dateFormat} onChange={this.handleDobChange} />
        <br />
        <br />
        SSN: <br />
        <Input onChange={this.handleSsnChange} value={this.state.ssn} />
        <br />
        <br />
        Account Type:
        <br />
        <Radio.Group
          onChange={this.handleAccountType}
          value={this.state.role_id}
        >
          <Radio value={1}>Individual</Radio>
          <Radio value={2}>Merchant</Radio>
        </Radio.Group>
        <br />
        <br />
        Address: <br />
        <Input onChange={this.handleAddress} value={this.state.address1} />
        <br />
        <br />
        Password: <br />
        <Input
          type="password"
          onChange={this.handlePassword}
          value={this.state.password}
        />
        <br />
        <br />
        Confirm Password: <br />
        <Input
          type="password"
          onChange={this.handleConfirmPassword}
          value={this.state.confirm_password}
        />
        <br />
        <br />
        <Button type="primary" onClick={this.onButtonClick}>
          Create Account
        </Button>
      </div>
    );
  }
}

export default withRouter(CreateUserAccount);