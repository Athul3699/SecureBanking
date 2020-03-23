import React, { Component } from "react";

import Select from 'react-select';
import './FundTransfer.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const options = [
  { value: 'debit', label: 'Debit' },
  { value: 'credit', label: 'Credit' },
  { value: 'savings', label: 'Savings' }
];

class FundTransfer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      payeeAcc: '',
      transAmount:'',
      transDesc:'',
      accType:'',
      startDate: new Date()
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChange(event){

    this.setState({ [event.target.name]: event.target.value });
    console.log(event.target.name); // the name of the form element
    console.log(event.target.value); // the value of the form element
  }

  handleSubmit(event) {
    

  }
  render() {
  return ( 
    <div className='main'>  
      <div className='fd'>  
      <h2 className="Transfer-header">Fund Transfer</h2>
      <form className='fd-inner' onSubmit={this.handleSubmit}>
      <br/>
          <label>From Account Type&nbsp;&nbsp;</label>
          <Select 
          name="accType"
          options={options} 
          placeholder={this.state.selectedValuePlaceholder}
          onChange={({value, label}) => this.setState({accType: value, selectedValuePlaceholder :
label})}
/>
         
          <br/>
          <label>Payee's Account&nbsp;&nbsp;</label><br/>
          <input type="text" name="payeeAcc" value={this.state.payeeAcc} onChange={this.handleChange} /><br/><br/>
          <label>Transfer Amount&nbsp;&nbsp;</label><br/>
          <input type="text" name="transAmount" value={this.state.transAmount} onChange={this.handleChange}/><br/><br/>
          <label>Transfer Date&nbsp;&nbsp;</label><br/>
          
          <DatePicker
      selected={this.state.startDate}
      onChange={date => {
        this.setState({
          startDate: date
        })}}
      minDate={new Date()}
    /><br/><br/>
          <label>Description&nbsp;&nbsp;</label><br/>
          <textarea name="transDesc" value={this.state.transDesc} onChange={this.handleChange} /><br/>
          <br/>
          <input type="submit" value="Transfer" />

          
        </form>
        
         
          






</div>  
</div>  
  );
  }
}

export default FundTransfer;
