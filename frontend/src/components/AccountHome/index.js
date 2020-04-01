import React, { Component } from 'react'
import 'antd/dist/antd.css'
import './style.css'

import {
    Input,
    Button,
    Radio,
    Select,
    InputNumber,
    Table,
    Tag
  } from 'antd';

import { postRequest,getRequest } from '../../util/api';
import { API_URL } from '../../constants/references';

const { Column } = Table
class AccountHome extends Component {
    constructor(props) {
        super(props)
        this.state = {
          accounts: [
					  {
						  "number":"1000000000",
						  "type":"checking",
						  "routing_number":"1234567",
						  "balance":100,
						  "user_id":1,
					  },
					  {
						  "number":"1000000002",
						  "type":"savings",
						  "routing_number":"1234567",
						  "balance":120,
						  "user_id":2,
					  },
					  {
						  "number":"1000000003",
						  "type":"credit card",
						  "routing_number":"1234567",
						  "balance":101,
						  "user_id":3,
					  },
					  {
						  "number":"1000000004",
						  "type":"savings",
						  "routing_number":"1234567",
						  "balance":105,
						  "user_id":1,
					  },
          ],      
        }
    }

    componentDidMount() {
      // getRequest(`${API_URL}/user/GetBankAccounts`)

      this.state.accounts.map( (i, account) => {
        return {}
      })
    }

    handleAccountTypeChange = (e) => {
      if(e.target.value==='fund_transfer') {
        this.setState({ accountType: e.target.value })
      } else {
        this.setState({ accountType: e.target.value })
      }
    }

    onButtonClick = () => {
      postRequest(`${API_URL}/api/v1/bank_account/BankAccount`, this.state)
      .then(() => {

      })
      .catch(() => {

      })
    }

    render() {
        return (

            <div className="create-form-container">
                <Button
                  
                >
                  Create Bank Account
                </Button>

                <br />
                <br />
                <Table dataSource={this.state.accounts}>
                  <Column title="Account Number" dataIndex="number" key="firstName" />
                  <Column title="Type" dataIndex="type" key="lastName" />
                  <Column title="Routing Number" dataIndex="routing_number" key="age" />
                  <Column title="Balance" dataIndex="balance" key="address" />
                  {/* <Column
                    title="Action"
                    key="action"
                    render={(text, record) => (
                      <span>
                        <a style={{ marginRight: 16 }}>Invite {record.lastName}</a>
                        <a>Delete</a>
                      </span>
                    )}
                  /> */}
                </Table>

            </div>
        );
    }
}

export default AccountHome