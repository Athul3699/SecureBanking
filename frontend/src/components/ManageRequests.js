import React, { Component } from "react";
import './Manage.css';
import List from './List';

class ManageRequests extends Component {
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
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit(event) {
    

  }
  render() {
  return ( 
    <div className="main">
      <div className="Search-box">
      <form className="form" onSubmit={this.handleSubmit}>
        <h2 className="Manage-header">Manage Requests</h2>
        <p className="Search-textinput">
          <label htmlFor="name">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Last Name&nbsp;&nbsp;</label>
          <input type="text" id="lastName" name="lastName"/>
        </p>
        <br />
        <p className="Search-textinput">        
          <label htmlFor="contactNumber">Contact Number&nbsp;&nbsp;</label>
          <input type="text" id="contactNumber" name="contactNumber"/>
        </p>
        <input type="submit" value="Search"/>
        </form>
      </div>
      <List page={"dispMR"}/>
    </div>
  );
  }
}

export default ManageRequests;
