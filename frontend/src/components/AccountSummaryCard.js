import React, { Component } from "react";
import FundTransfer from "./FundTransfer";
import PopUp from "./FundTransfer";
class AccountSummaryCard extends Component {
  state = {
    seen: false
    };
   togglePop = () => {
    this.setState({
     seen: !this.state.seen
    });
   };
  render() {

    return (
      <div style={{ padding: "50px" }}>
        <div style={{ borderStyle: "solid", padding: "50px" }}>
          <h1>Account (...0001)</h1>
          <p style={{ paddingTop: "50px" }}>Available balance</p>
          <h2>$1000</h2>
          <div>
    <div className="btn" onClick={this.togglePop}>
      <button> Transfer</button>
    </div>
    {this.state.seen ? <PopUp toggle={this.togglePop} /> : null}
   </div>
        </div>
      </div>
    );
  }
}

export default AccountSummaryCard;
