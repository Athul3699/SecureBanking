import React, { Component } from 'react'
import 'antd/dist/antd.css'
import './style.css'

import {
    Button,
    Table,
    Modal,
  } from 'antd';

import { postRequest, getRequest, deleteRequest, deleteRequestWithoutToken, getRequestWithoutToken } from '../../util/api';
import { API_URL } from '../../constants/references';
import { roleMap } from '../../constants/api'
import CreateEmployeeAccountTier1 from '../CreateEmployeeAccountTier1';
import UpdateContactInfo from '../UpdateContactInfo';

class ManageAccountsAdmin extends Component {
    constructor(props) {
        super(props)
        this.state = {  
          accounts: [
            {
              "first_name": "abc",
              "last_name": "abc",
              "email": "t@t.com",
              "password": "t",
              "address1": "asdsa",
              "address2": "asdsad",
              "date_of_birth": "2020/03/20",
              "ssn": "123456789",
              "contact": "asdasd",
              "role_id": 3
            }
          ],   
          t1Visible: false,
          t2Visible: false,
          createVisible: false,
          selectedAccount: {},

          isAuthorized: false,
          isLoading: true,
          error: false,
        }
    }

    componentDidMount() {
      this.setState({ isLoading: false, isAuthorized: true })
      this.refreshAccountsState()

      // getRequestWithoutToken(`${API_URL}/api/v1/auth/GetRole`) // make the get request (Athul - you need to make this work whenever Harshit pushes the code)
      // .then((data) => { // if it is successful

      //   const roleId = data["roleId"]
      //   if (roleId == 1) {
      //     this.setState({ isLoading: false, isAuthorized: true })
      //     this.refreshAccountsState()
      //   } else {
      //     this.setState({ isLoading: false, isAuthorized: false})
      //   }
      // })
      // .catch((err) => { // if it fails
      //   this.setState({ error: true })
      // })
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
      if (type == 'edit') {
        // TODO: route to update contact info of employee
        if (data['role_id'] == 3) {
          this.setState({ selectedAccount: data })
          this.setState({ t1Visible: true })
        } else if (data['role_id'] == 4) {
          this.setState({ selectedAccount: data })
          this.setState({ t2Visible: true })
        }
      } else if (type == 'delete') {
        deleteRequestWithoutToken(`${API_URL}/api/v1/admin/EmployeeAccount`).then()
        this.refreshAccountsState()
      } else if (type == 'create') {
        // TODO: route to create employee account page according to role
        // Create EmployeeAccount form
        this.setState({ selectedAccount: data })
        this.setState({ createVisible: true })
      }
    }

    handleOk = (type) => {
      if (type == 't1') {
        this.setState({ t1Visible: false })
      } else if (type == 't2') {
        this.setState({ t2Visible: false })
      } else {
        this.setState({ createVisible: false })
      }
    }

    handleCancel = (type) => {
      if (type == 't1') {
        this.setState({ t1Visible: false })
      } else if (type == 't2') {
        this.setState({ t2Visible: false })
      } else {
        this.setState({ createVisible: false })
      }
    }

    render() {
        // define columns
        const columns = [
          {
            title: 'First Name',
            dataIndex: 'first_name',
            key: 'first_name',
          },
          {
            title: 'Last Name',
            dataIndex: 'last_name',
            key: 'last_name',
          },
          {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
          },
          {
            title: 'Address',
            dataIndex: 'address1',
            key: 'address',
          },
          {
            title: 'DOB',
            dataIndex: 'date_of_birth',
            key: 'dob',
          },
          {
            title: 'contact',
            dataIndex: 'contact',
            key: 'contact',
          },
          {
            title: 'Role',
            dataIndex: 'role_id',
            key: 'role_id',
            render: text => text ? text : ''
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

        if (this.state.isLoading == true) { // if it is loading, show loading screen
          return <div> Loading... </div>
        } else {
          if (this.state.error == true) { // if it is loaded, and the initial api call has an error, show error screen
            return <div> Something went wrong here... Please reload the page or logout and login again to access the feature. </div>
          } else {
            if (this.state.isAuthorized == true) { // if it is loaded, and the initial api call does not have an error, and the response of the api call says they are authorized, render content
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
    
                    <Modal
                      title="Edit Tier 1 employee details"
                      visible={this.state.t1Visible}
                      onOk={() => this.handleOk('t1')}
                      onCancel={() => this.handleCancel('t1')}
                    >
                     <UpdateContactInfo // this should be a separate component for tier 1
                      account={this.state.selectedAccount}
                     /> 
                    </Modal>
    
                    <Modal
                      title="Edit Tier 2 employee details"
                      visible={this.state.t2Visible}
                      onOk={() => this.handleOk('t2')}
                      onCancel={() => this.handleCancel('t2')}
                    >
                      <UpdateContactInfo // this should be a separate component for tier 2
                        account={this.state.selectedAccount}
                     />
                    </Modal>
    
                    <Modal // this should be a separate component for just creating an employee account
                      title="Create Employee Account"
                      visible={this.state.createVisible}
                      onOk={() => this.handleOk('create')}
                      onCancel={() => this.handleCancel('create')}
                    >
                      <UpdateContactInfo
                        account={this.state.selectedAccount}
                      />
                    </Modal>
                </div>
              );
            } else { // if it is loaded, and the initial api call did not give an error, and response of the api call says they are not authorized
              return <div> Sorry. You are not authorized to view this page. </div>
            }
          }

        }
    }
}

export default ManageAccountsAdmin