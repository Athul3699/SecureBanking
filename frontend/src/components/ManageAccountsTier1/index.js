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

class ManageAccountsTier1 extends Component {
    constructor(props) {
        super(props)
        this.state = {
          accounts: [
          ],      
        }
    }

    componentDidMount() {
      this.refreshAccountsState()
    }

    // accounts state is what is shown.
    // we refresh this if the user deletes an account or whatever...
    refreshAccountsState = () => {
      getRequest(`${API_URL}/api/v1/auth/GetRole`) // make the get request (Athul - you need to make this work whenever Harshit pushes the code)
      .then((data) => { // if it is successful
        const roleId = data["roleId"]
        if (roleId == 3) {
          getRequest(`${API_URL}/api/v1/admin/GetAllUsersBankAccounts`)
          .then((data) => {
            // take the current accounts, and take only the data we need
            this.setState({ accounts: data["data"].map((account) => {
              return {
                number: account.number,
                type: account.type,
                routing_number: account.routing_number,
                balance: account.balance
              }
            })})
          })
            .catch((err) => {
              this.setState({ error: true })
              console.log(err)
            })
            


          getRequest(`${API_URL}/api/v1/admin/GetAllActiveUserRequests`)
            .then((data) => {
                this.setState({
                  accounts2: data["data"].map((account, i) => {
                    return {
                      first_name: account.first_name,
                      last_name: account.last_name,
                      email: account.email,
                      edit_data: JSON.stringify(account.edit_data),
                    }
                  })
                })
                this.setState({ isLoading: false, isAuthorized: true })
            })
            .catch((err) => {
              this.setState({ error: true })
              console.error(err)
            })
        } else {
          this.setState({ isLoading: false, isAuthorized: false })
        }
      })
      .catch((err) => { // if it fails
        this.setState({ error: true })
      })
    }


    onButtonClick = (type, data) => {
      if (type == 'accept') {
        postRequest(`${API_URL}/api/v1/admin/ManageUserRequest`, { email: JSON.parse(data.edit_data).email, edit_status: 2 })
          .then((data) => {
            this.refreshAccountsState() // refresh!
          })
          .catch((err) => {
            this.setState({ error: true })
            console.log(err)
          })
      } else if (type == 'deny') {
        postRequest(`${API_URL}/api/v1/admin/ManageUserRequest`, { email: JSON.parse(data.edit_data).email, edit_status: 3 })
          .then((data) => {
            this.refreshAccountsState() // refresh!
          })
          .catch((err) => {
            this.setState({ error: true })
            console.log(err)
          })
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
        ]

        const columns2 = [
          {
            title: 'First name',
            dataIndex: 'first_name',
            key: 'first_name',
          },
          {
            title: 'Last Name',
            dataIndex: 'last_name',
            key: 'last_name',
          },
          {
            title: 'Edit Data',
            dataIndex: 'edit_data',
            key: 'edit_data',
          },
          {
            title: 'Actions',
            key: 'actions',
            render: (text, data) => (
              <span>
                <a style={{ marginRight: 16 }} onClick={() => this.onButtonClick('accept', data)}> Accept </a>
                <a onClick={() => this.onButtonClick('deny', data)}> Deny </a>
              </span>
            )
          },
        ]
        return (

            <div className="create-form-container"> 

                Customer and Merchant Bank Accounts:
                <br />
                <br />
                <Table dataSource={this.state.accounts} columns={columns} />

                Customer and Merchant Requests:
                <br />
                <br />
                <Table dataSource={this.state.accounts2} columns={columns2} />
            </div>
        );
    }
}

export default ManageAccountsTier1