import React, { Component } from 'react'
import 'antd/dist/antd.css'
import './style.css'

import {
    Button,
    Table,
  } from 'antd';

import { postRequest, getRequest, deleteRequest, deleteRequestWithoutToken, getRequestWithoutToken } from '../../util/api';
import { API_URL } from '../../constants/references';
import { roleMap } from '../../constants/api'

class ManageRequestsAdmin extends Component {
    constructor(props) {
        super(props)
        this.state = {
          accounts: [],
          accounts2: [],      
        }
    }

    componentDidMount() {
      console.log("Just rendered here...")
      this.refreshAccountsState()
    }

    // accounts state is what is shown.
    // we refresh this if the user deletes an account or whatever...
    refreshAccountsState = () => {
      // get accounts
      getRequest(`${API_URL}/api/v1/transaction/AdminTransactions`)
      .then((data) => {
        // take the current accounts, and take only the data we need
        let accounts = data["data"].map((account) => {
          return {
            id: account.id,
            type: account.type,
            from_account: account.from_account,
            to_account: account.to_account,
            amount: account.amount,
            status: account.status,
            // is_critical: account.is_critical,
            description: account.description,
            message: account.message,
            // created_date: account.created_date
          }
        })

        this.setState({ accounts })
      })
      .catch((err) => {
        console.error(err)
      })
    }


    onButtonClick = (type, data) => {
      if (type == 'approve') {
        postRequest(`${API_URL}/api/v1/transaction/AdminApproveMoneyTransfer`, {id: data.id})
        .then((res) => {
          this.refreshAccountsState()
          this.props.history.push('/manageRequests')
        })
        .catch ((err) => console.log(err))
      } else if (type == 'deny') {
        postRequest(`${API_URL}/api/v1/transaction/AdminDeclineMoneyTransfer`, {id: data.id})
        .then((res) => {
          this.refreshAccountsState()
          this.props.history.push('/manageRequests')
          
        })
        .catch ((err) => console.log(err))
      }
    }

    render() {
      // define columns
      const columns = [
        {
          title: 'type',
          dataIndex: 'type',
          key: 'type',
        },
        {
          title: 'From Account',
          dataIndex: 'from_account',
          key: 'from_account',
        },
        {
          title: 'To Account',
          dataIndex: 'to_account',
          key: 'to_account',
        },
        {
          title: 'Amount',
          dataIndex: 'amount',
          key: 'amount',
        },
        {
          title: 'Status',
          dataIndex: 'status',
          key: 'status',
        },
        {
          title: 'Description',
          dataIndex: 'description',
          key: 'description',
        },
        {
          title: 'Message',
          dataIndex: 'message',
          key: 'message',
        },
        {
          title: 'Actions',
          key: 'actions',
          render: (text, data) => data.status === 'approved_by_destination' ? (
              <span>
                <a style={{ marginRight: 16 }} onClick={() => this.onButtonClick('approve', data)}> Approve </a>
                <a onClick={() => this.onButtonClick('deny', data)}> Deny </a>
              </span>
          ) : (<div></div>)  
        },
      ]
        return (

            <div className="create-form-container">
                {/* <Button
                  onClick={this.onButtonClick('create')}
                >
                  Create Account
                </Button> */}

                <Table dataSource={this.state.accounts} columns={columns} />
            </div>
        );
    }
}

export default ManageRequestsAdmin