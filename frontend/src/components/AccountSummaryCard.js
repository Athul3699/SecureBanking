import React, { Component } from "react";

class AccountSummaryCard extends Component {
  state = {};
  render() {
    return (
      <div style={{ padding: "50px" }}>
        <div style={{ borderStyle: "solid", padding: "50px" }}>
          <h1>Account (...0001)</h1>
          <p style={{ paddingTop: "50px" }}>Available balance</p>
          <h2>$1000</h2>
          <button>Transfer</button>
        </div>
      </div>
    );
  }
}

export default AccountSummaryCard;
