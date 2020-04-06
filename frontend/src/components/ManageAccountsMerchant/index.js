import React, { Component } from 'react'
import 'antd/dist/antd.css'
import './style.css'

import {
    Button,
    Table,
    Modal,
  } from 'antd';

import { postRequest, getRequest, deleteRequest, deleteRequestWithoutToken, getRequestWithoutToken, postRequestWithoutToken } from '../../util/api';
import { API_URL } from '../../constants/references';
import { roleMap } from '../../constants/api'
import UpdateContactInfo from '../UpdateContactInfo';


const status_map = {
  1: "SUBMITTED",
  2: "APPROVED",
  3: "DECLINED"
}

class ManageAccountsMerchant extends Component {
    constructor(props) {
        super(props)
        this.state = {  
          accounts: [],   
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
      getRequest(`${API_URL}/api/v1/auth/GetRole`) // make the get request (Athul - you need to make this work whenever Harshit pushes the code)
      .then((data) => { // if it is successful

        const roleId = data["roleId"]
        if (roleId == 2) {
          this.setState({ isLoading: false, isAuthorized: true })
          this.refreshAccountsState()
        } else {
          this.setState({ isLoading: false, isAuthorized: false})
        }
      })
      .catch((err) => { // if it fails
        this.setState({ error: true })
      })
    }

    // accounts state is what is shown.
    // we refresh this if the user deletes an account or whatever...
    refreshAccountsState = () => {

      postRequest(`${API_URL}/api/v1/admin/GetUserActiveRequest`)
            .then((data) => {
                this.setState({
                  accounts: data["data"].map((account, i) => {
                    return {
                      first_name: account.first_name,
                      last_name: account.last_name,
                      email: account.email,
                      edit_data: JSON.stringify(account.edit_data),
                      status: status_map[account.edit_status]
                    }
                  })
                })
                this.setState({ isLoading: false, isAuthorized: true })
            })
            .catch((err) => {
              this.setState({ error: true })
              console.error(err)
            })
    }

    goToLogin = () => {
      this.props.history.push('')
    }

    render() {

        // define columns
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
            title: 'Edit Data',
            dataIndex: 'edit_data',
            key: 'edit_data',
          },
          {
            status: 'Status',
            dataIndex: 'status',
            key: 'status',
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
    
                    Account Update Request Information:
                    <br />
                    <br />
                    <Table dataSource={this.state.accounts} columns={columns} />
                </div>
              );
            } else {
              return (
                <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
                  You are not authorized... Please log in again.           
                  <Button onClick={() => this.goToLogin()}> Go back to login </Button>
                </div>
              ) 
            }
          }

        }
    }
}

export default ManageAccountsMerchant