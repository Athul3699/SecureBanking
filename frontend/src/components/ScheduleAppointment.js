import React, { Component } from "react";
import { getRequest, postRequest } from '../util/api';
import { API_URL } from '../constants/references';
import { Menu, Select, DatePicker, Button} from 'antd';
import { DownOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';
import { Input } from 'antd';
// import './ScheduleAppointment.css';

import moment from 'moment';
const { TextArea } = Input;
const { Option } = Select;
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
  console.log(current);
  return current && current < moment().endOf('day');
}



class ScheduleAppointment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account_number: [],
      month: 0,
      year: 0,
      date: 0,
      reason: "",
      slot:"1",
      appointments:[],
      disableSlots:[false,false,false,false,false],
      toggleSelect: true,
      accountId: null,
      isAuthorizedSchedule: false
    };

    this.onChange = this.onChange.bind(this);
    this.onButtonClick = this.onButtonClick.bind(this);
    this.validate = this.validate.bind(this);
    this.onTextChange = this.onTextChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    if (window.localStorage.getItem('API_TOKEN')) {
    getRequest(`${API_URL}/api/v1/appointment/FilledSlots`)
    .then((data) => {
      console.log(data);
      this.setState({appointments:data, isAuthorizedSchedule:true});
    })
    .catch((error) => console.log(error))
  }
    else {
      console.log("Invalid Token")
      this.setState({ isAuthorizedSchedule: false })
    }
  }
  onChange(value, dateString) {
    console.log('Selected Time: ', value);
    console.log('Formatted Selected Time: ', dateString);
    var dateArray = dateString.split("-");
    console.log(parseInt(dateArray[0]));
    console.log(parseInt(dateArray[1]));
    console.log(parseInt(dateArray[2]));


    //this.setState({ date:parseInt(dateArray[2]), month:parseInt(dateArray[1]), year:parseInt(dateArray[0])});
    this.updateSlots(dateString);
  }

  updateSlots(dateString){
    var dateArray = dateString.split("-");
    let arr = this.state.appointments.data;
    //console.log(moment(arr[0].date).format('YYYY-MM-DD'));
    let disabled = [false,false,false,false, false];
    for(var i=0;i<arr.length;i++){
      if(moment(arr[i].date.split(",")[1].slice(0,-13)).format('YYYY-MM-DD')===dateString) {
        console.log("here");
        disabled[parseInt(arr[i].slot_time)-1] = true;
      }
    }
    this.setState({ date:parseInt(dateArray[2]), month:parseInt(dateArray[1]), year:parseInt(dateArray[0])});
    this.setState({disableSlots:disabled});
    this.setState({toggleSelect:false});
  }

  onTextChange = ({ target: { value } }) => {
    this.setState({ reason:value });
  };
  validate(){
    
    if(this.state.reason===""){
      alert("Please provide the reason for appointment");
      return false;
    }

    return true;
  }

  onButtonClick = () => {
    if(this.validate()){

      console.log(this.state.year+"/"+this.state.month+"/"+this.state.date);
      postRequest(`${API_URL}/api/v1/appointment/Schedule`, { "slot_time": this.state.slot, "date": this.state.year+"/"+this.state.month+"/"+this.state.date, "reason": this.state.reason })
      .then((data) => {
        console.log(data);
        alert("Appointment Scheduled Successfully");
        this.props.history.push(`/`)
      })
    .catch((error) => console.log(error))
    }
  }

  handleChange(value) {
    console.log(`selected ${value}`);
    this.setState({slot:value})
  }

  goToLogin = () => {
    this.props.history.push('')
  }

  render() {
    if(this.state.isAuthorizedSchedule){
    const onClick = ({ key }) => {
      console.log(key);
    };


    return (
      <div>
   
        <br />
        <br />
        Select date:
        <br />
        <div >
        <DatePicker  onChange={this.onChange}
          showButtonPanel="false"
          format="YYYY-MM-DD"
          disabledDate={disabledDate}
          hideDisabledOptions
          defaultValue={moment().add(1, 'day')}
        />
        </div>
        <br></br>
        Select time slots:
        <br></br>
        <>
    <Select style={{ width: 240 }} onChange={this.handleChange} disabled={this.state.toggleSelect}>
      <Option value="1" disabled={this.state.disableSlots[0]}>10:00AM - 11:00AM</Option>
      <Option value="2" disabled={this.state.disableSlots[1]}>11:00AM - 12:00PM</Option>
      <Option value="3" disabled={this.state.disableSlots[2]}>02:00PM - 03:00PM</Option>
      <Option value="4" disabled={this.state.disableSlots[3]}>03:00PM - 04:00PM</Option>
      <Option value="5" disabled={this.state.disableSlots[4]}>04:00PM - 05:00PM</Option>
    </Select>
  </>
        <br />
        <br />
        <br />
        Reason for appointment:
        <TextArea 
          onChange={this.onTextChange}
          rows={4} 
          autoSize={{ minRows: 6, maxRows: 6 }}
          />
        
        <Button type="primary" onClick={this.onButtonClick}>Schedule</Button>
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

export default ScheduleAppointment;