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

function formatNumber(value) {
  value += '';
  const list = value.split('.');
  const prefix = list[0].charAt(0) === '-' ? '-' : '';
  let num = prefix ? list[0].slice(1) : list[0];
  let result = '';
  while (num.length > 3) {
    result = `,${num.slice(-3)}${result}`;
    num = num.slice(0, num.length - 3);
  }
  if (num) {
    result = num + result;
  }
  return `${prefix}${result}${list[1] ? `.${list[1]}` : ''}`;
}

const { TextArea } = Input
const { Option } = Select

class CreateBankAccount extends Component {
    constructor(props) {
        super(props)
        this.state = {
            accountType: 'debit',
            balance:1000,        
        }
    }

    onButtonClick = () => {
      // route to appropriate page
    }

    componentDidMount() {
      // getRequest(`${API_URL}/user/GetBankAccounts`)
    }

    render() {
        return (

            <div className="create-form-container">
                Account Type:<br />
                <Radio.Group onChange={this.handleAccountTypeChange} value={this.state.accountType}>
                   <Radio value={"debit"}>Debit</Radio>
                    <Radio value={"credit"}>Credit</Radio>
                    <Radio value={"fund_transfer"}>Fund Transfer</Radio>
                </Radio.Group>

                <br />
                <br />

                Opening balance:<br />
                <InputNumber
                  defaultValue={1000}
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

export default CreateBankAccount