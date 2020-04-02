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

import { withRouter } from "react-router-dom"

class CreateBankAccountTier2 extends Component {
    constructor(props) {
        super(props)
        this.state = {
            type: 'checking',
            balance: 10,        
        }
    }

    onButtonClick = () => {
      // route to appropriate page
      postRequest(`${API_URL}/api/v1/admin/tier2/CreateCustomerBankAccount`, this.state)
      .then((res) => this.props.handleCancel('create'))
      .catch((err) => console.log(err))
    }

    componentDidMount() {
      // getRequest(`${API_URL}/user/GetBankAccounts`)
    }

    handleAccountTypeChange = (e) => {
      this.setState({ type: e.target.value })
    }

    handleAmountChange = (e) => {
      this.setState({ balance: e })
    }

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
                  onClick={this.onButtonClick}
                >
                  Submit Request
                </Button>

            </div>
        );
    }
}

export default withRouter(CreateBankAccountTier2)