import React, { Component } from "react";
import MonthYearPicker from 'react-month-year-picker';
import { postRequest } from '../util/api';
import { API_URL } from '../constants/references';
import { Menu, Dropdown, DatePicker, Button} from 'antd';
import { DownOutlined } from '@ant-design/icons';
class BankingStatements extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account_number: [],
      account: "",
      month: 0,
      year: 0,
      statements: [],
      accountId: null
    };

    this.onChange = this.onChange.bind(this);
    this.onButtonClick = this.onButtonClick.bind(this);
    this.validate = this.validate.bind(this);
  }

  // componentDidMount() {
  //   console.log('GrandChild did mount.');
  //   postRequest(`${API_URL}/user/GetBankAccounts`)
  //   .then((data) => {
  //     console.log(data);
  //     this.setState({account_number:data});
  //     window.localStorage.setItem('API_TOKEN', data["data"]["token"])
  //   })
  //   .catch((error) => console.log(error))
  // }

  onChange(date, dateString) {
    var dateArray = dateString.split("-");
    console.log(parseInt(dateArray[0]));
    console.log(parseInt(dateArray[1]));
    this.setState({month:parseInt(dateArray[1]), year:parseInt(dateArray[0])});
 
  }

  validate(){
    if(this.state.account===""){
      alert("Select the account");
      return false;
    }
    if(this.state.month===0){
      alert("Select the month");
      return false;
    }
    if(this.state.year===0){
      alert("Select the year");
      return false;
    }

    return true;
  }

  onButtonClick(event){
    if(this.validate()){
    postRequest(`${API_URL}/api/v1/transaction/DownloadStatements`, { "month": this.state.month, "year": this.state.year, "account_number": this.state.account })
    .then((data) => {
      //set state for statements
      window.localStorage.setItem('API_TOKEN', data["data"]["token"])
    })
    .catch((error) => console.log(error))
  }
  }

  render() {
    const onClick = ({ key }) => {
      console.log(key);
    };

    const menu = (
      <Menu onClick={onClick}>
      {this.state.account_number.map((account) => 
        <Menu.Item key={account}>{account}</Menu.Item>
      )
      }
      </Menu>
    );
    return (
      <div>
        <Dropdown overlay={menu}>
          <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
            Select Account <DownOutlined />
          </a>
        </Dropdown>
        <br />
        <br />
        <br />
        <DatePicker onChange={this.onChange} picker="month" />
        <br />
        <br />
        <br />
        <Button type="primary" onClick={this.onButtonClick}>Download Statements</Button>
      </div>
    );
  }
}

export default BankingStatements;
