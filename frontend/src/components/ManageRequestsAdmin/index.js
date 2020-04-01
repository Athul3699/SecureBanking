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
          accounts: [
            // {
            //   "type": "abc",
            //   "from_account": "abc",
            //   "to_account": "t@t.com",
            //   "amount": "t",
            //   "status": "asdsa",
            //   "awaiting_action_from_auth_level": "asdsad",
            //   "last_approved_by": "2020/03/20",
            //   "is_active": "123456789",

            // }
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
      getRequestWithoutToken(`${API_URL}/api/v1/admin/GetAllEmployees`)
      .then((data) => {
        // take the current accounts, and take only the data we need
        let accounts = this.state.accounts.map((account) => {
          return {
            first_name: account.first_name,
            last_name: account.last_name,
            email: account.email,
            address1: account.address1,
            date_of_birth: account.date_of_birth,
            contact: account.contact,
            role_id: account.role_id,
            role_id_modified: roleMap[account.role_id],
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
        // TODO: route to update contact info of employee
      } else if (type == 'decline') {
        deleteRequestWithoutToken(`${API_URL}/api/v1/admin/EmployeeAccount`).then()
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
            title: 'Awaiting Action From',
            dataIndex: 'awaiting_action_from_auth_level',
            key: 'awaiting_action_from_auth_level',
          },
          {
            title: 'Last Approved By',
            dataIndex: 'last_approved_by',
            key: 'last_approved_by',
          },
          {
            title: 'Actions',
            key: 'actions',
            render: (text, data) => (
              <span>
                <a style={{ marginRight: 16 }} onClick={this.onButtonClick('approve', data)}> Approve </a>
                <a onClick={this.onButtonClick('decline', data)}> Decline </a>
              </span>
            )
          },
        ]
        return (

            <div className="create-form-container">
                <Button
                  onClick={this.onButtonClick('create')}
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

export default ManageRequestsAdmin