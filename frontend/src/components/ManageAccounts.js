import React, { Component } from "react";
import './Manage.css';
import List from './List';

class ManageAccounts extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lastName: null,
      contactNumber: null,

      formErrors: {
        lastName: "",
        contactNumber: ""
      }
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChange(event){

    this.setState({ [event.target.name]: event.target.value });

  }
  handleSubmit(event) {
    

  }
  render() {
  return ( 
    <div className="mng">
      <div className="Search-box">  
        <form className="form" onSubmit={this.handleSubmit}>
        <p className="Manage-header">Manage Accounts</p>
        <span>
        <p className="Search-textinput">
        <br /><br /><label htmlFor="name">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Last Name&nbsp;&nbsp;</label>
          <input type="text" name="lastName" value={this.state.lasName} onChange={this.handleChange}/>
        </p>
        <br />
        <p className="Search-textinput">
        
          <label htmlFor="contactNumber">Contact Number&nbsp;&nbsp;</label>
          <input type="text" name="contactNumber" value={this.state.contactNumber} onChange={this.handleChange}/>
        </p>
        </span>
        <span className="mng-submit"><input type="submit" value="Search"/></span>
        
        </form>

      </div>
      <List page={"dispMA"}/>
    </div>

  );
  }
}

export default ManageAccounts;
