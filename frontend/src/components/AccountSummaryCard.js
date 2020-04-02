import React, { Component } from "react";
import FundTransfer from "./FundTransfer";
import PopUp from "./FundTransfer";

class AccountSummaryCard extends Component {
  state = {
    showPopup: false
    };
    
    togglePopup() {  
      this.setState({  
        showPopup: !this.state.showPopup,
      });
    }
  render() {

    return (
      <div>
        {this.state.showPopup ? <PopUp closePopup={this.togglePopup.bind(this)}  /> : null}
      <div style={{ padding: "50px" }}>
        
        <div style={{ borderStyle: "solid", padding: "50px" }}>
          <h1>Account (...0001)</h1>
          <p style={{ paddingTop: "50px" }}>Available balance</p>
          <h2>$1000</h2>
          <div>
    <div className="btn">
      <button onClick={this.togglePopup.bind(this)}> Transfer</button>
    </div>
    
   </div>
        </div>
      </div>
      </div>
    );
  }
}

export default AccountSummaryCard;
