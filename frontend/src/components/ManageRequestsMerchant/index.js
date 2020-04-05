import React, { Component } from "react";
import "antd/dist/antd.css";
import "./style.css";

import { Button, Table } from "antd";

import {
  postRequest,
  getRequest,
  deleteRequest,
  deleteRequestWithoutToken,
  getRequestWithoutToken
} from "../../util/api";
import { API_URL } from "../../constants/references";
import { roleMap } from "../../constants/api";

class ManageRequestsMerchant extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accounts: [],
      accounts2: []
    };
  }

  // componentDidMount() {
  //   console.log("Just rendered here...")
  //   this.refreshAccountsState()
  // }

  componentDidMount() {
    getRequest(`${API_URL}/api/v1/auth/GetRole`) // make the get request (Athul - you need to make this work whenever Harshit pushes the code)
      .then(data => {
        // if it is successful

        const roleId = data["roleId"];
        if (roleId == 2) {
          this.setState({ isLoading: false, isAuthorized: true });
          this.refreshAccountsState();
        } else {
          this.setState({ isLoading: false, isAuthorized: false });
        }
      })
      .catch(err => {
        // if it fails
        this.setState({ error: true });
      });
  }

  // accounts state is what is shown.
  // we refresh this if the user deletes an account or whatever...
  refreshAccountsState = () => {
    // get accounts
    getRequest(`${API_URL}/api/v1/transaction/MerchantTransactions`)
      .then(data => {
        // take the current accounts, and take only the data we need
        let accounts = data["data"]["transactions_to"].map(account => {
          return {
            id: account.id,
            type: account.type,
            from_account: account.from_account,
            to_account: account.to_account,
            amount: account.amount,
            status: account.status,
            // is_critical: account.is_critical,
            description: account.description,
            message: account.message
            // created_date: account.created_date
          };
        });

        let accounts2 = data["data"]["transactions_from"].map(account => {
          return {
            id: account.id,
            type: account.type,
            from_account: account.from_account,
            to_account: account.to_account,
            amount: account.amount,
            status: account.status,
            // is_critical: account.is_critical,
            description: account.description,
            message: account.message
            // created_date: account.created_date
          };
        });

        this.setState({ accounts, accounts2 });
      })
      .catch(err => {
        console.error(err);
      });
  };

  onButtonClick = (type, data) => {
    if (type == "approve") {
      postRequest(
        `${API_URL}/api/v1/transaction/MerchantApproveMoneyTransfer`,
        { id: data.id }
      )
        .then(res => {
          this.props.history.push("/manageRequests");
          this.refreshAccountsState();
        })
        .catch(err => console.log(err));
    } else if (type == "deny") {
      postRequest(
        `${API_URL}/api/v1/transaction/MerchantDeclineMoneyTransferCritical`,
        { id: data.id }
      )
        .then(res => {
          this.props.history.push("/manageRequests");
          this.refreshAccountsState();
        })
        .catch(err => console.log(err));
    }
  };

  render() {
    // define columns
    const columns = [
      {
        title: "type",
        dataIndex: "type",
        key: "type"
      },
      {
        title: "From Account",
        dataIndex: "from_account",
        key: "from_account"
      },
      {
        title: "To Account",
        dataIndex: "to_account",
        key: "to_account"
      },
      {
        title: "Amount",
        dataIndex: "amount",
        key: "amount"
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status"
      },
      {
        title: "Description",
        dataIndex: "description",
        key: "description"
      },
      {
        title: "Message",
        dataIndex: "message",
        key: "message"
      },
      {
        title: "Actions",
        key: "actions",
        render: (text, data) =>
          data.status === "submitted" ? (
            <span>
              <a
                style={{ marginRight: 16 }}
                onClick={() => this.onButtonClick("approve", data)}
              >
                {" "}
                Approve{" "}
              </a>
              <a onClick={() => this.onButtonClick("deny", data)}> Deny </a>
            </span>
          ) : (
            <div></div>
          )
      }
    ];

    const columns2 = [
      {
        title: "type",
        dataIndex: "type",
        key: "type"
      },
      {
        title: "From Account",
        dataIndex: "from_account",
        key: "from_account"
      },
      {
        title: "To Account",
        dataIndex: "to_account",
        key: "to_account"
      },
      {
        title: "Amount",
        dataIndex: "amount",
        key: "amount"
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status"
      },
      {
        title: "Description",
        dataIndex: "description",
        key: "description"
      },
      {
        title: "Message",
        dataIndex: "message",
        key: "message"
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
        if (this.state.isAuthorized == true) {
          return (
            <div className="create-form-container">
              {/* <Button
                    onClick={this.onButtonClick('create')}
                  >
                    Create Account
                  </Button> */}
              Inbound transactions
              <br />
              <br />
              <Table dataSource={this.state.accounts} columns={columns} />
              Outbound transactions
              <br />
              <br />
              <Table dataSource={this.state.accounts2} columns={columns2} />
            </div>
          );
        } else {
          return <div> Sorry. You are not authorized to view this page. </div>;
        }
      }
    }
  }
}

export default ManageRequestsMerchant;
