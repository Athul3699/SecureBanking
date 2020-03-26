import React, { Component } from "react";
import MonthYearPicker from 'react-month-year-picker';
import { postRequest } from '../util/api';
import { API_URL } from '../constants/references';
class BankingStatements extends Component {
  constructor(props) {
    super(props);
    this.state = {
      month: 4,
      year: 2020,
      statements: []
    };

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event){
    postRequest(`${API_URL}/api/v1/auth/LoginUser`, { "month": this.state.month, "password": this.state.year })
    .then((data) => {
      //set state for statements
      window.localStorage.setItem('API_TOKEN', data["data"]["token"])
    })
    .catch((error) => console.log(error))
  }

  render() {
    var buttonStyle = {
      margin: '10px 10px 10px 0'
    };
    const list = ['a', 'b', 'c'];
    return (
      <div>
        <MonthYearPicker
          selectedMonth={this.state.month}
          selectedYear={this.state.year}
          minYear={2000}
          maxYear={2030}
          onChangeYear={year => this.setState({ year: year })}
          onChangeMonth={month => this.setState({ month: month })}
        />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <button
        className="btn btn-default"
        style={buttonStyle}
        onClick={this.handleClick}>Get Statements
      </button>
      {/* <ul>
        {this.state.statements.map(item => (
          <li key={item}>{item}&nbsp;&nbsp;&nbsp;&nbsp;<a><img src="./download.png" alt="download"/></a></li>
        ))}
      </ul> */}
      </div>
    );
  }
}

export default BankingStatements;
