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

class ManageAccountsAdmin extends Component {
    constructor(props) {
        super(props)
        this.state = {
          accounts: [
          ],   
          isAuthorizedManageAccountsAdmin: false   
        }
    }

    componentDidMount() {
      this.refreshAccountsState()
    }

    // accounts state is what is shown.
    // we refresh this if the user deletes an account or whatever...
    refreshAccountsState = () => {
      if (window.localStorage.getItem('API_TOKEN')) {
        getRequest(`${API_URL}/api/v1/auth/GetRole`) // make the get request (Athul - you need to make this work whenever Harshit pushes the code)
        .then((data) => { // if it is successful
          if(data.status === "success"){
            this.setState({isAuthorizedManageAccountsAdmin: true});
          }
          else{
            console.log("token invalid");
            this.setState({ isAuthorizedManageAccountsAdmin: false })
          }
            const roleId = data["roleId"]
          if (roleId === 5 && data.status === "success") {
            getRequest(`${API_URL}/api/v1/admin/GetAllEmployees`)
            .then((data) => {
              // take the current accounts, and take only the data we need
              this.setState({ accounts: data["data"].map((account) => {
                return {
                  first_name: account.first_name,
                  last_name: account.last_name,
                  email: account.email,
                  address1: account.address1,
                  contact: account.contact,
                }
              })})
            
            })
            .catch((err) => {
              this.setState({ error: true })
              console.log(err)
            })
            
            getRequest(`${API_URL}/api/v1/admin/GetAllActiveEmployeeRequests`)
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
            this.setState({ isLoading: false, isAuthorizedManageAccountsAdmin: false })
          }
        })
        .catch((err) => { // if it fails
          this.setState({ error: true, isAuthorizedManageAccountsAdmin: false })
        })
      }
    }
    goToLogin = () => {
      this.props.history.push('')
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
      if(this.state.isAuthorizedManageAccountsAdmin){
        const columns = [
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
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
          },
          {
            title: 'Address',
            dataIndex: 'address1',
            key: 'address1',
          },
          {
            title: 'Contact',
            dataIndex: 'contact',
            key: 'contact',
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

                Employee Accounts:
                <br />
                <br />
                <Table dataSource={this.state.accounts} columns={columns} />

                Employee Account Requests:
                <br />
                <br />
                <Table dataSource={this.state.accounts2} columns={columns2} />
            </div>
        );
      }
      else {
        return (
          <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
            You are not authorized... Please log in again.           
            <Button onClick={() => this.goToLogin()}> Go back to login </Button>
          </div>
        ) 
      }
    }
}

export default ManageAccountsAdmin