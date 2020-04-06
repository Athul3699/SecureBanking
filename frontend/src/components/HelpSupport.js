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
      message:'',
      email: ''
    };
  }
  componentDidMount() {
    this.refreshAccountState()
  }
  refreshAccountState = () => {
  }

  setComponentSize = () => {
    this.setState({ componentSize: "small" });
  };
  
  handleDescriptionChange = e => {
    this.setState({ message: e.target.value });
  };
  
  validate = () => {
    if (this.state.message==="") {
      alert("Please enter your feedback in the textarea");
      return false;
    }

    var re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    if (re.test(String(this.state.email).toLowerCase()) == false) {
      this.setState({email:""});
      alert("The email entered is not valid!!")
      return false
    }

    return true;
  };

  onEmailChange = (e) => this.setState({ email: e.target.value })

  onButtonClick = () => {
    if (this.validate()) {
      const body = {
        "message": this.state.message,
        "email": this.state.email,
      }
      this.setState({ message: '', email: '' });
      //console.log(body);
      postRequest(`${API_URL}/api/v1/admin/PostFeedback`, body)
      .then((data) => {
        alert("Thank you for your feedback! Somebody will contact you soon on the email address provided.");
        this.setState({ message: '', email: '' })
        this.props.history.goBack()
      })
    } else {
      alert('Please enter valid input...')
    }
  };

  render() {
  return ( 

      <div className="create-form-container">
      <h4>Help &amp; Support</h4>
      <br />
        <br />

        Email you want to be contacted to:
        <Input
          onChange={this.onEmailChange}
          value={this.state.email}
        />
        <br /><br />

        Feedback/Report Problem:
        <TextArea
        id='feedbackContent'
          rows={4}
          value={this.state.message}
          allowClear
          onChange={this.handleDescriptionChange}
          autoSize={{ minRows: 6, maxRows: 6 }}
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

