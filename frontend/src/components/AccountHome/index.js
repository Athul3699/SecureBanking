import React, { Component } from 'react'
import 'antd/dist/antd.css'
import './style.css'

import {
    Button,
    Table,
    Modal,
  } from 'antd';

import CreateBankAccount from '../CreateBankAccount'
import TransferFunds from '../TransferFunds'
import { getRequest, postRequest } from '../../util/api';
import { API_URL } from '../../constants/references';
import { Link, NavLink } from 'react-router-dom';

const { Column } = Table

class AccountHome extends Component {
    constructor(props) {
        super(props)
        this.state = {
          accounts: [],
          transferVisible: false,
          createVisible: false,
        }
    }

    componentDidMount() {
      this.refreshAccountState()
    }

    refreshAccountState = () => {
      getRequest(`${API_URL}/api/v1/bank_account/GetCustomerAccounts`)
      .then((data) => {
        console.log(data["data"])
        if (data["data"].length > 0) {
          this.setState({ accounts: data["data"].map( (account, i) => {
            return {
              number: account.number,
              type: account.type,
              routing_number: account.routing_number,
              balance: account.balance,
              is_active: String(account.is_active),
            }
          })})
        }
      })
      .catch ((err) => console.log(err))
    }

    handleOk = (type) => {
      if (type == 'create') {
        this.setState({ createVisible: true })
      } else {
        this.setState({ transferFundsVisible: true })
      }
    }

    handleCancel = (type) => {
      if (type == 'create') {
        this.setState({ createVisible: false })
        this.refreshAccountState()
      } else {
        this.setState({ transferFundsVisible: false })
        this.refreshAccountState()
      }
    }


    onButtonClick = (type, data) => {
      if (type == 'transfer') {
        this.setState({ transferFundsVisible: true })
      } else if (type == 'create') {
        this.setState({ createVisible: true })
      }
    }

    render() {
let dispTrans=""
    if(this.state.transferFundsVisible){
      dispTrans = <TransferFunds />;
    }
        return (
            <div className="create-form-container">

                <div
                  style={{
                    display: 'flex',
                    flex: 1,
                    justifyContent: 'space-between'
                  }}
                >

                <Button
                  onClick={() => this.onButtonClick('create')}
                >
                  Create Bank Account
                </Button>

                
                <Button
                  onClick={() => this.onButtonClick('transfer')}
                >
                  Banking
                </Button>

                
                </div>

                <br />
                <br />
                <Table dataSource={this.state.accounts}>
                  <Column title="Account Number" dataIndex="number" key="firstName" />
                  <Column title="Type" dataIndex="type" key="lastName" />
                  <Column title="Routing Number" dataIndex="routing_number" key="age" />
                  <Column title="Balance" dataIndex="balance" key="address" />
                  <Column title="Is Active" dataIndex="is_active" key="is_active" />
                </Table>

                <Modal
                  title="Create New Bank Account"
                  visible={this.state.createVisible}
                  onOk={() => this.handleOk('create')}
                  onCancel={() => this.handleCancel('create')}
                >
                  <CreateBankAccount // this should be a separate component for tier 2
                    handleCancel={this.handleCancel}
                 />
                </Modal>

                <Modal // this should be a separate component for just creating an employee account
                  title="Banking"
                  visible={this.state.transferFundsVisible}
                  onOk={() => this.handleOk('transfer')}
                  onCancel={() => this.handleCancel('transfer')}
                >
                  {dispTrans}
                </Modal>

            </div>
        );
    }
}

export default AccountHome