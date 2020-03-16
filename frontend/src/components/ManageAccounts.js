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
  }
  render() {
  return (
    
    <div className="main">
      <div className="Search-box">
        
        <div class="form">
        <h2 className="Manage-header">Manage Accounts</h2>
        <p className="Search-textinput">
          <label for="name">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Last Name&nbsp;&nbsp;</label>
          <input type="text" id="lastName" name="lastName"/>
        </p>
        <br />
        <p className="Search-textinput">
        
          <label for="contactNumber">Contact Number&nbsp;&nbsp;</label>
          <input type="text" id="contactNumber" name="contactNumber"/>
        </p>
        <input type="submit" value="Search"/>
      </div>
      </div>
      <List />
    </div>
  );
  }
}

export default ManageAccounts;
