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
					  },
					  {
						  "number":"1000000002",
						  "type":"savings",
						  "routing_number":"1234567",
						  "balance":120,
					  },
					  {
						  "number":"1000000003",
						  "type":"credit card",
						  "routing_number":"1234567",
						  "balance":101,
					  },
					  {
						  "number":"1000000004",
						  "type":"savings",
						  "routing_number":"1234567",
						  "balance":105,
					  },
          ],
          transferVisible: false,
          createVisible: false,
        }
    }

    componentDidMount() {
      this.state.accounts.map( (i, account) => {
        return {}
      })
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
      } else {
        this.setState({ transferFundsVisible: false })
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
                </Table>

                <Modal
                  title="Create New Bank Account"
                  visible={this.state.createVisible}
                  onOk={() => this.handleOk('create')}
                  onCancel={() => this.handleCancel('create')}
                >
                  <CreateBankAccount // this should be a separate component for tier 2
                 />
                </Modal>

                <Modal // this should be a separate component for just creating an employee account
                  title="Banking"
                  visible={this.state.transferFundsVisible}
                  onOk={() => this.handleOk('transfer')}
                  onCancel={() => this.handleCancel('transfer')}
                >
                  <TransferFunds
                  />
                </Modal>

            </div>
        );
    }
}

export default AccountHome