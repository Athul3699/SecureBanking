import React, { Component } from "react";
import MonthYearPicker from 'react-month-year-picker';
import { getRequest, postRequest } from '../util/api';
import { API_URL } from '../constants/references';
import { Menu, Select, DatePicker, Button} from 'antd';
import { DownOutlined } from '@ant-design/icons';

const { Option } = Select;
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

componentDidMount() {
    this.refreshAccountState()
  }

  refreshAccountState = () => {
    getRequest(`${API_URL}/api/v1/bank_account/GetActiveCustomerAccounts`)
    .then((data) => {
      console.log(data["data"])
      if (data["data"].length > 0) {
        this.setState({ account_number: data["data"].map( (account, i) => {
          return {
            number: account.number,
          }
        })})
      }
    })
    .catch ((err) => console.log(err))
  }

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
  handleAccountSourceChange = value => {
    this.setState({ account: value });
  };
  onButtonClick(event){
    if(this.validate()){
    postRequest(`${API_URL}/api/v1/transaction/DownloadStatements`, { "month": this.state.month, "year": this.state.year, "account_number": this.state.account })
    .then((response) => response.blob())
    .then((blob) => {
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `sample.${this.state.file}`);
      // 3. Append to html page
      document.body.appendChild(link);
      // 4. Force download
      link.click();
      // 5. Clean up and remove the link
      link.parentNode.removeChild(link);
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
        Account:
        <br />
        <Select
          style={{ width: 200 }}
          onChange={this.handleAccountSourceChange}
        >
          {this.state.account_number.map((account, i) => (
            <Option key={i} value={account.number}>
              {" "}
              {account.number}{" "}
            </Option>
          ))}
        </Select>
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
