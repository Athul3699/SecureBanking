import React, { Component } from "react";
import "antd/dist/antd.css";
import "./style.css";

import { Input, Button, Radio, Select, InputNumber, DatePicker } from "antd";
import { postRequestWithoutToken, postRequest } from "../../util/api";
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

class EditEmployeeAccountAdminPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      first_name: props.account.first_name,
      last_name: props.account.last_name,
      email: props.account.email,
      date_of_birth: props.account.date_of_birth,
      address1: props.account.address1,
      contact: props.account.contact,
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

  handleAccountTypeChange = e => {
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

    if (this.state.contact.length < 10) {
      alert("The contact number should be 10 digits");
      return false;
    }

    // if (this.state.password.length < 7) {
    //   alert("The password should contain minimum 7 characters");
    //   return false;
    // }

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
      postRequest(`${API_URL}/api/v1/admin/EditEmployeeAccount`, data)
        .then(() => {
          // route to appropriate page
          this.props.handleCancel()
        })
        .catch(() => {
          // display error message. not needed for now, we can assume api is stable.
          this.props.handleCancel()
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

        Address: <br />
        <Input onChange={this.handleAddress} value={this.state.address1} />
        <br />
        <br />
        
        <Button type="primary" onClick={() => this.onButtonClick()}>
          Edit Account
        </Button>
      </div>
    );
  }
}

export default EditEmployeeAccountAdminPage;
