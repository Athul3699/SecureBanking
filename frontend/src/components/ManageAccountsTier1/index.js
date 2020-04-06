import React, { Component } from "react";
import "antd/dist/antd.css";
import "./style.css";

import { Button, Table } from "antd";

import {
  postRequest,
  getRequest,
  deleteRequest,
  deleteRequestWithoutToken,
  getRequestWithoutToken,
  putRequestWithoutToken
} from "../../util/api";
import { API_URL } from "../../constants/references";
import { roleMap } from "../../constants/api";

class ManageAccountsTier1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accounts: [
        {
          number: "123456789",
          type: "1",
          routing_number: "123456789",
          balance: 12345
        }
      ],
      isAuthorizedManageAccountsTier1: false,
      isLoading: false
    };
  }

  componentDidMount() {
    if (window.localStorage.getItem("API_TOKEN")) {
      getRequest(`${API_URL}/api/v1/auth/GetRole`) // make the get request (Athul - you need to make this work whenever Harshit pushes the code)
        .then(data => {
          // if it is successful
          if (data.status === "success") {
            this.setState({ isAuthorizedManageAccountsTier1: true });
          } else {
            console.log("token invalid");
            this.setState({ isAuthorizedManageAccountsTier1: false });
          }

          const roleId = data["roleId"];
          if (roleId === 3 && data.status === "success") {
            this.setState({
              isLoading: false,
              isAuthorizedManageAccountsTier1: true
            });
            this.refreshAccountsState();
          } else {
            this.setState({
              isLoading: false,
              isAuthorizedManageAccountsTier1: false
            });
          }
        })
        .catch(err => {
          // if it fails
          this.setState({
            error: true,
            isAuthorizedManageAccountsTier1: false
          });
        });
    }
  }

  // accounts state is what is shown.
  // we refresh this if the user deletes an account or whatever...
  refreshAccountsState = () => {
    // get accounts
    getRequest(`${API_URL}/api/v1/admin/GetAllUsersBankAccounts`)
      .then(data => {
        // take the current accounts, and take only the data we need
        let accounts = this.state.accounts.map(account => {
          return {
            number: account.number,
            type: account.type,
            routing_number: account.routing_number,
            balance: account.balance
          };
        });

        this.setState({ accounts });
      })
      .catch(err => {
        console.error(err);
        this.setState({
          error: true,
          isAuthorizedManageAccountsTier1: false
        });
      });
  };

  goToLogin = () => {
    this.props.history.push("");
  };

  onButtonClick = (type, data) => {
    if (type == "edit") {
      // TODO: route to update bank account info of
    } else if (type == "delete") {
      putRequestWithoutToken(
        `${API_URL}/api/v1/bank_account/BankAccount`
      ).then();
      this.refreshAccountsState();
    } else if (type == "create") {
      // TODO: route to create employee account page according to role
      // Create EmployeeAccount form
    }
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
        title: "Account Type",
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
        if (this.state.isAuthorizedManageAccountsTier1 == true) {
          return (
            <div className="create-form-container">
              <Button onClick={() => this.onButtonClick("create")}>
                Create Account
              </Button>

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

export default ManageAccountsTier1;
