import React, { Component } from 'react'
import 'antd/dist/antd.css'
import './style.css'

import {
    Input,
    Button,
    Radio,
    Select,
    InputNumber
  } from 'antd';
import { postRequest,getRequest } from '../../util/api';
import { API_URL } from '../../constants/references';

class CreateBankAccountTier2 extends Component {
    constructor(props) {
        super(props)
        this.state = {
            type: 'checking',
            balance: 10,
        }
    }

    onButtonClick = () => {

      if (this.validate()){
        postRequest(`${API_URL}/api/v1/admin/tier2/CreateCustomerBankAccount`, this.state)
        .then((data) => {
          if (data["status"] === "failure" ) {
            alert('Your request failed! Check if the user with that email exists in the system.')
          } else {
            alert('Successful!')
            this.props.handleCancel('create')
          }
        })
        .catch((err) => console.log(err))
      } else {
        // do nothing... alert is rendered in the validate() function
      }
    }

    componentDidMount() {
      // getRequest(`${API_URL}/user/GetBankAccounts`)
    }

    handleAccountTypeChange = (e) => {
      this.setState({ type: e.target.value })
    }

    handleEmail = (e) => {
      this.setState({ email: e.target.value })
    }

    handleAmountChange = (e) => {
      this.setState({ balance: e })
    }



    validate = () => {
      var re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

      if (re.test(String(this.state.email).toLowerCase()) == false) {
        alert("The email entered is not valid!! Please CLEAR it and try again.")
        this.setState({ email: ''})
        return false
      }

      return true;
    }

    render() {
        return (

            <div className="create-form-container">

                User Email: <br />
                <Input
                  value={this.state.email}
                  onChange={this.handleEmail}
                />

                <br /><br />

                Account Type:<br />
                <Radio.Group onChange={this.handleAccountTypeChange} value={this.state.type}>
                   <Radio value={"checking"}>Checking</Radio>
                    <Radio value={"savings"}>Savings</Radio>
                    <Radio value={"credit_card"}>Credit Card</Radio>
                </Radio.Group>

                <br />
                <br />

                Opening balance:<br />
                <InputNumber
                  defaultValue={10}
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

export default CreateBankAccountTier2