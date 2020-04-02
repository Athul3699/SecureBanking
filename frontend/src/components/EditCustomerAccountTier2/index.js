import React, { Component } from "react";
import "antd/dist/antd.css";
import "./style.css";

import { Input, Button, Radio, Select, InputNumber, DatePicker } from "antd";
import { postRequestWithoutToken, postRequest } from "../../util/api";
import { API_URL } from "../../constants/references";


class EditCustomerAccountTier2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: props.account.type,
      balance: props.account.balance,
      number: props.account.number,
    };
  }

  componentDidMount() {
    // getRequest(`${API_URL}/user/GetBankAccounts`)
  }

  setComponentSize = () => {
    this.setState({ componentSize: "small" });
  };

  handleAccountTypeChange = e => {
    this.setState({ type: e.target.value })
  }

  handleAmountChange = value => {
    this.setState({ balance: value });
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

  handleType = e => {
    this.setState({ type: e.target.value });
  }

  validate = () => {
    if (!this.state.type || this.state.balance<=0 ) {
      alert('please choose the right values for the fields')
      return false
    }

    return true;
  };

  onButtonClick = () => {
    if (this.validate()) {
      let data = this.state;

      postRequest(`${API_URL}/api/v1/admin/tier2/EditCustomerBankAccount`, data)
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
        Account Type:<br />
        <Radio.Group onChange={this.handleAccountTypeChange} value={this.state.type}>
            <Radio value={"checking"}>Checking</Radio>
            <Radio value={"savings"}>Savings</Radio>
            <Radio value={"credit_card"}>Credit Card</Radio>
        </Radio.Group>

        <br />
        <br />

        Balance:<br />
        <InputNumber
          formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={value => value.replace(/\$\s?|(,*)/g, '')}
          onChange={this.handleAmountChange}
        />

        <br />
        <br />

        <Button
          type="primary"
          onClick={() => this.onButtonClick()}
        >
          Submit Request
        </Button>

    </div>
    );
  }
}

export default EditCustomerAccountTier2;
