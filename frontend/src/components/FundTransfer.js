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

  

class TransferFunds extends Component {
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
    <div className='fd'>  
    <div className="Transfer-header">Fund Transfer</div>
      <div className='fd-inner'>  
      
      <form onSubmit={this.handleSubmit}>
      <span className="fd-select">
        <label>From Account Type&nbsp;&nbsp;</label> 
          <Select 
          name="accType"
          options={options} 
          placeholder={this.state.selectedValuePlaceholder}
          onChange={({value, label}) => this.setState({accType: value, selectedValuePlaceholder :label})}/>

        </span>
        <span className="fd-input">
          <label>Payee's Account&nbsp;&nbsp;</label>
          <input type="text" name="payeeAcc" value={this.state.payeeAcc} onChange={this.handleChange} /><br/><br/>
        </span>
        <span className="fd-input">
          <label>Transfer Amount&nbsp;&nbsp;</label>
          <input type="text" name="transAmount" value={this.state.transAmount} onChange={this.handleChange}/><br/><br/>
        </span>
        <span className="fd-input"><label>Transfer Date&nbsp;&nbsp;</label>
          <DatePicker
            selected={this.state.startDate}
            onChange={date => {this.setState({startDate: date})}}
            minDate={new Date()}
          />
        </span>
        <span className="fd-textarea">
          <label>Description&nbsp;&nbsp;</label>
          <textarea style={{ resize: "none", height: "100px" }} name="transDesc" value={this.state.transDesc} onChange={this.handleChange} />
        </span>
<div className="fd-button"><span><input type="submit" value="Transfer" /></span>
        <span><button className="button" onClick={this.props.closePopup}>Go Back</button>  
</span></div>
     
        </form>
</div>  
</div>  
  );
  }
}

export default TransferFunds;
