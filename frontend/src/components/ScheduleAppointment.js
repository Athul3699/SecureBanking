import React, { Component } from "react";
import { postRequest } from '../util/api';
import { API_URL } from '../constants/references';
import { Menu, Select, DatePicker, Button} from 'antd';
import { DownOutlined } from '@ant-design/icons';
import moment from 'moment';
const { RangePicker } = DatePicker;
function range(start, end) {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
}
function disabledDate(current) {
  // Can not select days before today and today
  return current && current < moment().endOf('day');
}

function disabledDateTime() {
  return {
    disabledHours: () => [0, 1, 2, 3, 4, 5, 6, 7, 8, 17, 18, 19, 20, 21, 22, 23],


  };
}
const { Option } = Select;

class ScheduleAppointment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account_number: [],
      month: 0,
      year: 0,
      date: 0,
      hour: 0,
      minute: 0,
      location: 'Phoenix',
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
  onChange(value, dateString) {
    console.log('Selected Time: ', value);
    console.log('Formatted Selected Time: ', dateString);
    var vArray = dateString.split(" ");
    var dateArray = vArray[0].split("-");
    console.log(parseInt(dateArray[0]));
    console.log(parseInt(dateArray[1]));
    console.log(parseInt(dateArray[2]));
    var timeArray =vArray[1].split(":");
    console.log(parseInt(timeArray[0]));
    console.log(parseInt(timeArray[1]));
    this.setState({minute:parseInt(timeArray[1]), hour:parseInt(timeArray[0]), date:parseInt(dateArray[2]), month:parseInt(dateArray[1]), year:parseInt(dateArray[0])});
 

  }

  handleLocationChange =value => {
    this.setState({ location: value });
  };
  validate(){
    if(this.state.date===0){
      alert("Select the date");
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

    //postRequest(`${API_URL}/api/v1/transaction/DownloadStatements`, { "month": this.state.month, "year": this.state.year, "account_number": this.state.account })
    //.then((data) => {
      //set state for statements
     // window.localStorage.setItem('API_TOKEN', data["data"]["token"])
    //})
   // .catch((error) => console.log(error))
  }
  }

  render() {
    const onClick = ({ key }) => {
      console.log(key);
    };

    return (
      <div>
        <br />
        Select location:
        <br />
        <Select defaultValue="Phoenix" style={{ width: 120 }} onChange={this.handleLocationChange}>
      <Option value="Tempe">Tempe</Option>
      <Option value="Mesa">Mesa</Option>
      <Option value="Scottsdale">Scottsdale</Option>
    </Select>
   
        <br />
        <br />
        Select date and time:
        <br />
        <DatePicker onChange={this.onChange}
      format="YYYY-MM-DD HH:mm"
      disabledDate={disabledDate}
      disabledTime={disabledDateTime}
      hideDisabledOptions
      minuteStep={30}
      showTime={{ defaultValue: moment('09:00', 'HH:mm') }}
    />
<br /><br />
        <br />
        
        <Button type="primary" onClick={this.onButtonClick}>Schedule</Button>
      </div>
    );
  }
}

export default ScheduleAppointment;
