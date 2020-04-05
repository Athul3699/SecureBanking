import React, { Component } from "react";
import "antd/dist/antd.css";
import "./style.css";
import TransferOverLimit from '../TransferOverLimit'
import { Input, Button, Radio, Select, InputNumber } from "antd";
import { postRequest, getRequest, postRequestWithoutToken } from "../../util/api";
import { API_URL } from "../../constants/references";
import { withRouter } from "react-router-dom"

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
      amount: 10,
      finalizeForum:false,
      otp:"",
      otpVerified:false,
    };
  }

  componentDidMount() {
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
  handleotp = e => {
    this.setState({ otp: e.target.value });
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

  handlePayeeTypeChange = e => {
    this.setState({ payeeType: e.target.value })
  }
  onSendOTP = () => {
    this.setState({ finalizeForum: true })
    postRequestWithoutToken(`${API_URL}/api/v1/otp/GenerateOTP`, this.state)
.then(() =>{})
.catch(() => {});
  }

  onVerifyOTP = () => {
    //postRequestWithoutToken(`${API_URL}/api/v1/otp/VerifyOTP`, this.state)
//.then(() =>
this.setState({ otpVerified: true })
//)
//.catch(() => {});
    
  }



  validate = () => {
    if (this.state.amount.length < 1) {
      alert("Enter a valid number in Amount!");
      return false;
    }
    if (this.state.amount.length < 1) {
      alert("Amount field should have a numeric value!");
      return false;
    }
    if (this.state.accountSource==="") {
      alert("Select account or create a bank account if there is none");
      return false;
    }
    var amt = parseFloat(this.state.amount);
    if (isNaN(amt)) {
      alert("Payee account field should have a numeric value");
      return false;
    }

    if (this.state.accountType == "fund_transfer") {
      if (this.state.destinationAccount.length < 1) {
        alert("Enter a valid payee account number");
        return false;
      }
    }
    return true;
  };
  
  onButtonClick = () => {
    if (this.validate()) {
      const body = {
        "from_account": this.state.accountSource,
        "to_account": this.state.destinationAccount,
        "amount": this.state.amount,
        "type": this.state.accountType,
        "description": this.state.description,
        "payee_type": "account"
      }
postRequest(`${API_URL}/api/v1/transaction/InitiateMoneyTransfer`, body)
.then(() => this.props.history.push('/manageRequests'))
.catch(() => {});
      
    }
    else {
      alert("Invalid values in the form!!");
    }
  };

  render() {
    const isEnabled = this.state.amount<=1000;
    return (
      <div className="create-form-container">
        Account Type:
        <br />
        <Radio.Group
          onChange={this.handleAccountTypeChange}
          value={this.state.accountType}
          disabled={this.state.finalizeForum}
        >
          <Radio value={"debit"}>Debit</Radio>
          <Radio value={"credit"}>Credit</Radio>          
          <Radio value={"fund_transfer"}>Fund Transfer</Radio>
          <Radio value={"cashiers_cheque"}>Cashier's cheque (Give Recepients name in the message)</Radio>
        </Radio.Group>
        <br />
        <br />

        Payee Type:
        <br />
        <Radio.Group
          onChange={this.handlePayeeTypeChange}
          value={this.state.payeeType}
          disabled={this.state.accountType !== 'fund_transfer'||this.state.finalizeForum}
        >
          <Radio value={"account"}>Account</Radio>
          <Radio value={"email"}>Email</Radio>
          <Radio value={"contact"}>Contact</Radio>
        </Radio.Group>
        <br />
        <br />

        Account:
        <br />
        <Select
          style={{ width: 200 }}
          onChange={this.handleAccountSourceChange}
          disabled={this.state.finalizeForum}
        >
          {this.state.accounts.map((account, i) => (
            <Option key={i} value={account.number}>
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
          disabled={this.state.accountType != 'fund_transfer'||this.state.finalizeForum}
        />
        <br />
        <br />
        Amount:
        <br />
        <InputNumber
          defaultValue={10}
          formatter={value =>
            `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={value => value.replace(/\$\s?|(,*)/g, "")}
          onChange={this.handleAmountChange}
          disabled={this.state.finalizeForum}
        />
        <br />
        <br />

       
        Description:
        <TextArea
          rows={4}
          value={this.state.description}
          allowClear
          onChange={this.handleDescriptionChange}
          disabled={this.state.finalizeForum}
        />
        <br />
        <br />
        <Button type="primary" onClick={() => this.onButtonClick()} disabled={!isEnabled&&!this.state.otpVerified}>
          Submit Request
        </Button>
        <br />
        <br />
        <Button type="primary" onClick={() => this.onSendOTP()} disabled={isEnabled||this.state.otpVerified}>
          Send verification code
        </Button>
        <br />
        <br />
        Enter the verification code sent to your registered email:
        <Input
          onChange={this.handleOTP}
          disabled={!this.state.finalizeForum||this.state.otpVerified}
        />

        <Button type="primary" onClick={() => this.onVerifyOTP()} disabled={!this.state.finalizeForum||this.state.otpVerified}>
          Verify
        </Button>
        <br />
      </div>
    );
  }
}

export default withRouter(TransferFunds);