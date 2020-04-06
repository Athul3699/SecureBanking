import React, { Component } from "react";
import "antd/dist/antd.css";
import "./style.css";

import { Button, Table, Modal } from "antd";

import {
  postRequest,
  getRequest,
  deleteRequest,
  deleteRequestWithoutToken,
  getRequestWithoutToken
} from "../../util/api";
import { API_URL } from "../../constants/references";
import { roleMap } from "../../constants/api";
// import CreateEmployeeAccountTier1 from '../CreateEmployeeAccount';
import UpdateContactInfo from "../UpdateContactInfo";
import CreateEmployeeAccount from "../CreateEmployeeAccountAdminPage";
import EditEmployeeAccountAdminPage from "../EditEmployeeAccountAdminPage";
import CreateBankAccountTier2 from "../CreateBankAccountTier2";
import EditCustomerAccountTier2 from "../EditCustomerAccountTier2";

const { Column } = Table;
class ManageAccountsTier2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accounts: [],
      t1Visible: false,
      t2Visible: false,
      createVisible: false,
      selectedAccount: {},

      isAuthorizedManageAccountsTier2: false,
      isLoading: true,
      error: false
    };
  }

  componentDidMount() {
    if (window.localStorage.getItem("API_TOKEN")) {
      getRequest(`${API_URL}/api/v1/auth/GetRole`) // make the get request (Athul - you need to make this work whenever Harshit pushes the code)
        .then(data => {
          // if it is successful
          if (data.status === "success") {
            this.setState({ isAuthorizedManageAccountsTier2: true });
          } else {
            console.log("token invalid");
            this.setState({ isAuthorizedManageAccountsTier2: false });
          }
          const roleId = data["roleId"];
          if (roleId == 4 && data.status === "success") {
            this.setState({
              isLoading: false,
              isAuthorizedManageAccountsTier2: true
            });
            this.refreshAccountState();
          } else {
            this.setState({
              isLoading: false,
              isAuthorizedManageAccountsTier2: false
            });
          }
        })
        .catch(err => {
          // if it fails
          this.setState({
            error: true,
            isAuthorizedManageAccountsTier2: false
          });
        });
    }
  }

  refreshAccountState = () => {
    getRequest(`${API_URL}/api/v1/admin/tier2/GetAllCustomerBankAccounts`)
      .then(data => {
        console.log(data["data"]);
        if (data["data"].length > 0) {
          this.setState({
            accounts: data["data"].map((account, i) => {
              return {
                number: account.number,
                type: account.type,
                routing_number: account.routing_number,
                balance: account.balance,
                is_active: String(account.is_active)
              };
            })
          });
        }
        this.setState({
          isLoading: false,
          isAuthorizedManageAccountsTier2: true
        });
      })
      .catch(err => {
        console.log(err);
        this.setState({
          error: true,
          isAuthorizedManageAccountsTier2: false
        });
      });
  };

  goToLogin = () => {
    this.props.history.push("");
  };

  onButtonClick = (type, data) => {
    if (type == "edit") {
      this.setState({ t1Visible: true, selectedAccount: data });
    } else if (type == "delete") {
      postRequest(`${API_URL}/api/v1/admin/tier2/DeleteCustomerBankAccount`, {
        number: data.number
      })
        .then(res => this.refreshAccountState())
        .catch(err => console.log(err));
    } else if (type == "create") {
      this.setState({ selectedAccount: data });
      this.setState({ createVisible: true });
    }
  };

  handleOk = (type, data) => {
    if (type == "t1") {
      this.setState({ t1Visible: false });
      this.setState({ selectedAccount: data });
    } else if (type == "t2") {
      this.setState({ t2Visible: false });
    } else {
      this.setState({ createVisible: false });
    }
    this.refreshAccountState();
  };

  handleCancel = type => {
    if (type == "t1") {
      this.setState({ t1Visible: false });
    } else if (type == "t2") {
      this.setState({ t2Visible: false });
    } else {
      this.setState({ createVisible: false });
    }
    this.refreshAccountState();
  };

  render() {
    // define columns
    const columns = [
      {
        title: "Account Number",
        dataIndex: "number",
        key: "number"
      },
      {
        title: "Type",
        dataIndex: "type",
        key: "type"
      },
      {
        title: "Routing Number",
        dataIndex: "routing_number",
        key: "routing_number"
      },
      {
        title: "Balance",
        dataIndex: "balance",
        key: "balance"
      },
      {
        title: "Actions",
        key: "actions",
        render: (text, data) => (
          <span>
            <a
              style={{ marginRight: 16 }}
              onClick={() => this.onButtonClick("edit", data)}
            >
              {" "}
              Edit{" "}
            </a>
            <a onClick={() => this.onButtonClick("delete", data)}> Delete </a>
          </span>
        )
      }
    ];

    if (this.state.isLoading == true) {
      // if it is loading, show loading screen
      return <div> Loading... </div>;
    } else {
      if (this.state.error == true) {
        // if it is loaded, and the initial api call has an error, show error screen
        return (
          <div>
            {" "}
            Something went wrong here... Please reload the page or logout and
            login again to access the feature.{" "}
          </div>
        );
      } else {
        if (this.state.isAuthorizedManageAccountsTier2 == true) {
          // if it is loaded, and the initial api call does not have an error, and the response of the api call says they are authorized, render content
          return (
            <div className="create-form-container">
              <Button onClick={() => this.onButtonClick("create")}>
                Create Customer Bank Account
              </Button>

              <br />
              <br />
              <Table dataSource={this.state.accounts} columns={columns}></Table>

              <Modal
                title="Edit Customer Bank Account details"
                visible={this.state.t1Visible}
                onOk={() => this.handleOk("t1")}
                onCancel={() => this.handleCancel("t1")}
              >
                <EditCustomerAccountTier2 // this should be a separate component for tier 1
                  account={this.state.selectedAccount}
                  handleCancel={() => this.handleCancel("t1")}
                />
              </Modal>

              <Modal // this should be a separate component for just creating an employee account
                title="Create Customer Bank Account"
                visible={this.state.createVisible}
                onOk={() => this.handleOk("create")}
                onCancel={() => this.handleCancel("create")}
              >
                <CreateBankAccountTier2 />
              </Modal>
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

export default ManageAccountsTier2;
