import React, { Component } from "react";
class BankingStatements extends Component {
  state = {

    };
  render() {
    const list = ['a', 'b', 'c'];
    return (
      <div style={{ padding: "50px" }}>
        <ul>
    {list.map(item => (
      <li key={item}>{item}&nbsp;&nbsp;&nbsp;&nbsp;<a><img src="./download.png" alt="download"/></a></li>
    ))}
  </ul>
      </div>
    );
  }
}

export default BankingStatements;
