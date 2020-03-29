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

class CreateAccount extends Component {
    constructor(props) {
        super(props)
        this.state = {
            transferType: 'debit',
            componentSize: 'small',
            accounts: [{ number: 1234 }],
            destinationAccount: '',
            amount:1000,
            accountSource: '',
            showDestinationAccount:false
        }
    }

    componentDidMount() {
      // getRequest(`${API_URL}/user/GetBankAccounts`)
    }

    setComponentSize = () => {
        this.setState({ componentSize: 'small' })
    }

    handletransferTypeChange = (e) => {
      if(e.target.value==='fund_transfer') {
        this.setState({ transferType: e.target.value, showDestinationAccount: true})
      } else {
        this.setState({ transferType: e.target.value, showDestinationAccount: false})
      }
    }

    handleAccountSourceChange = (value) => {
        this.setState({ accountSource: value })
    }

    handleAmountChange = (value) => {
      this.setState({ amount: value })
    }

    handleDescriptionChange = (e) => {
      this.setState({ description: e.target.value })
    }

    handleDestinationAccountChange = (e) => {
      this.setState({ destinationAccount: e.target.value })
    }

    onButtonClick = () => {
      postRequest(`${API_URL}/api/v1/transaction/InitiateMoneyTransfer`, this.state)
      .then(() => {

      })
      .catch(() => {

      })
    }

    render() {
        return (

            <div className="create-form-container">
                Transaction Type:<br />
                <Radio.Group onChange={this.handletransferTypeChange} value={this.state.transferType}>
                   <Radio value={"debit"}>Debit</Radio>
                    <Radio value={"credit"}>Credit</Radio>
                    <Radio value={"fund_transfer"}>Fund Transfer</Radio>
                </Radio.Group>

                <br />
                <br />

                Account:<br />
                <Select
                  style={{ width: 200 }} onChange={this.handleAccountSourceChange}>
                  {this.state.accounts.map( (account, i) => <Option key={i} value={i}> { account.number} </Option>)}
                </Select>

                <br />
                <br />
                { this.state.showDestinationAccount &&
                <div>Payee Account Number:<br />
                <Input
                  style={{ width: 200,marginTop:0 }}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  onChange={this.handleDestinationAccountChange}
                />
                <br />
                <br />
                </div>
                }

                Amount:<br />
                <InputNumber
                  defaultValue={1000}
                  formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  onChange={this.handleAmountChange}
                />

                <br />
                <br />

                Description:<br />
                <TextArea
                  style={{ width: 400 }}
                  rows={4}
                  value={this.state.description}
                  allowClear
                  onChange={this.handleDescriptionChange}
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

export default CreateAccount