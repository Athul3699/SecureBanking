import React, { Component } from "react";
import "antd/dist/antd.css";
import "./style.css";

import { Input, Button, Radio, Select, InputNumber } from "antd";
import { postRequest, getRequest } from "../../util/api";
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

class TransferFunds extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accountType: "debit",
      componentSize: "small",
      accounts: [],
      destinationAccount: null,
      accountSource: "",
      description: "",
      amount: "",
    };
  }

  componentDidMount() {
    // getRequest(`${API_URL}/user/GetBankAccounts`)
    this.refreshAccountState()
  }

  refreshAccountState = () => {
    getRequest(`${API_URL}/api/v1/bank_account/GetActiveCustomerAccounts`)
    .then((data) => {
      console.log(data["data"])
      if (data["data"].length > 0) {
        this.setState({ accounts: data["data"].map( (account, i) => {
          return {
            number: account.number,
          }
        })})
      }
    })
    .catch ((err) => console.log(err))
  }

  setComponentSize = () => {
    this.setState({ componentSize: "small" });
  };

  handleAccountTypeChange = e => {
    this.setState({ accountType: e.target.value });
  };

  handleAccountSourceChange = value => {
    this.setState({ accountSource: value });
  };

  handleAmountChange = value => {
    this.setState({ amount: value });
  };

  handleDescriptionChange = e => {
    this.setState({ description: e.target.value });
  };

  handleDestinationAccountChange = e => {
    this.setState({ destinationAccount: e.target.value });
  };

  validate = () => {
    // if (
    //   !this.state.accountSource ||
    //   !this.state.amount ||
    //   !this.state.destinationAccount ||
    //   !this.state.accountType
    // ) {
    //   alert("Some fields are unfilled !!!");
    //   return false;
    // }
    if (this.state.amount.length < 1) {
      alert("Enter a valid number in Amount!");
      return false;
    }
    if (this.state.amount.length < 1) {
      alert("Amount field should have a numeric value!");
      return false;
    }
    var amt = parseFloat(this.state.amount);
    if (isNaN(amt)) {
      alert("Payee account field should have a numeric value");
      return false;
    }
    if (this.state.destinationAccount.length < 1) {
      alert("Enter a valid payee account number");
      return false;
    }
    return true;
  };

  onButtonClick = () => {
    if (this.validate()) {
      postRequest(`${API_URL}/common/CreateAccount`, this.state)
        .then(() => {})
        .catch(() => {});
    } else {
      alert("Invalid values in the form!!");
    }
  };

  render() {
    return (
      <div className="create-form-container">
        Account Type:
        <br />
        <Radio.Group
          onChange={this.handleAccountTypeChange}
          value={this.state.accountType}
        >
          <Radio value={"debit"}>Debit</Radio>
          <Radio value={"credit"}>Credit</Radio>
          <Radio value={"fund_transfer"}>Fund Transfer</Radio>
        </Radio.Group>
        <br />
        <br />
        Account:
        <br />
        <Select
          style={{ width: 200 }}
          onChange={this.handleAccountSourceChange}
        >
          {this.state.accounts.map((account, i) => (
            <Option key={i} value={i}>
              {" "}
              {account.number}{" "}
            </Option>
          ))}
        </Select>
        <br />
        <br />

        Payee Account Number:
        <br />
        <Input
          parser={value => value.replace(/\$\s?|(,*)/g, "")}
          onChange={this.handleDestinationAccountChange}
          disabled={this.state.accountType != 'fund_transfer'}
        />
        <br />
        <br />
        Amount:
        <br />
        <InputNumber
          defaultValue={1000}
          formatter={value =>
            `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={value => value.replace(/\$\s?|(,*)/g, "")}
          onChange={this.handleAmountChange}
        />
        <br />
        <br />
        Description:
        <TextArea
          rows={4}
          value={this.state.description}
          allowClear
          onChange={this.handleDescriptionChange}
        />
        <br />
        <br />
        <Button type="primary" onClick={this.onButtonClick}>
          Submit Request
        </Button>
      </div>
    );
  }
}

export default TransferFunds;