import React, { Component } from "react";

import "antd/dist/antd.css";
import './HelpSupport.css';

import { Input, Button, Radio, Select, InputNumber } from "antd";
import { postRequest, getRequest } from "../util/api";
import { API_URL } from "../constants/references";
import { withRouter } from "react-router-dom"

const { TextArea } = Input;
const { Option } = Select;

class HelpSupport extends Component {
  constructor(props) {
    super(props);
    this.state = {

      description:''
    };
  }
  componentDidMount() {
    this.refreshAccountState()
  }
  refreshAccountState = () => {
    //getRequest(`${API_URL}/api/v1/bank_account/GetActiveCustomerAccounts`)
    //.then((data) => {
     // console.log(data["data"])
      //if (data["data"].length > 0) {
        //this.setState({ accounts: data["data"].map( (account, i) => {
         // return {

         // }
       // })})
     // }
 //   })
 //   .catch ((err) => console.log(err))
  }
  setComponentSize = () => {
    this.setState({ componentSize: "small" });
  };
  
  handleDescriptionChange = e => {
    this.setState({ description: e.target.value });
  };
  
  validate = () => {
    if (this.state.description==="") {
      alert("Please enter your feedback in the textarea");
      return false;
    }

    return true;
  };

  onButtonClick = () => {
    if (this.validate()) {
      const body = {
        "description": this.state.description

      }

      postRequest(`${API_URL}/api/v1/transaction/InitiateMoneyTransfer`, body)
        .then(() => this.props.history.push('/manageRequests'))
        .catch(() => {});
    } else {
      alert("Invalid values in the form!!");
    }
  };

  render() {
  return ( 

      <div className="create-form-container">
      <h4>Help &amp; Support</h4>
      <br />
        <br />
        Feedback/Report Problem:
        <TextArea
          rows={4}
          value={this.state.description}
          allowClear
          onChange={this.handleDescriptionChange}
        />
        <br />
        <br />
        <Button type="primary" onClick={() => this.onButtonClick()}>
          Submit Request
        </Button>
      </div>
  );
  }
}
export default withRouter(HelpSupport);

