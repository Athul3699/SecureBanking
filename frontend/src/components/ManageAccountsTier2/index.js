import React, { Component } from 'react'
import 'antd/dist/antd.css'
import './style.css'

import {
    Button,
    Table,
  } from 'antd';

import { postRequest, getRequest, deleteRequest, deleteRequestWithoutToken, getRequestWithoutToken, putRequestWithoutToken } from '../../util/api';
import { API_URL } from '../../constants/references';
import { roleMap } from '../../constants/api'

class ManageAccountsTier2 extends Component {
    constructor(props) {
        super(props)
        this.state = {
          accounts: [
            {
              "number": "123456789",
              "type": "1",
              "routing_number": "123456789",
              "balance": 12345,
            },
          ],      
        }
    }

    componentDidMount() {
      this.refreshAccountsState()
    }

    // accounts state is what is shown.
    // we refresh this if the user deletes an account or whatever...
    refreshAccountsState = () => {
      // get accounts
      getRequestWithoutToken(`${API_URL}/api/v1/admin/GetAllUsersBankAccounts`)
      .then((data) => {
        // take the current accounts, and take only the data we need
        let accounts = this.state.accounts.map((account) => {
          return {
            number: account.number,
            type: account.type,
            routing_number: account.routing_number,
            balance: account.balance
          }
        })

        this.setState({ accounts })
      })
      .catch((err) => {
        console.error(err)
      })
    }


    onButtonClick = (type, data) => {
      if (type == 'edit') {
        // TODO: route to update bank account info of 
      } else if (type == 'delete') {
        putRequestWithoutToken(`${API_URL}/api/v1/bank_account/BankAccount`).then()
        this.refreshAccountsState()
      } else if (type == 'create') {
        // TODO: route to create employee account page according to role
        // Create EmployeeAccount form
      }
    }

    render() {
      // define columns
        const columns = [
          {
            title: 'Account Number',
            dataIndex: 'number',
            key: 'number',
          },
          {
            title: 'Account Type',
            dataIndex: 'type',
            key: 'type',
          },
          {
            title: 'Routing Number',
            dataIndex: 'routing_number',
            key: 'routing_number',
          },
          {
            title: 'Balance',
            dataIndex: 'balance',
            key: 'balance',
          },
          {
            title: 'Actions',
            key: 'actions',
            render: (text, data) => (
              <span>
                <a style={{ marginRight: 16 }} onClick={() => this.onButtonClick('edit', data)}> Edit </a>
                <a onClick={() => this.onButtonClick('delete', data)}> Delete </a>
              </span>
            )
          },
        ]
        return (

            <div className="create-form-container">
                <Button
                  onClick={() => this.onButtonClick('create')}
                >
                  Create Account
                </Button>

                <br />
                <br />
                <Table dataSource={this.state.accounts} columns={columns} />
            </div>
        );
    }
}

export default ManageAccountsTier2