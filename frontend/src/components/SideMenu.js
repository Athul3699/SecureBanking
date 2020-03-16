import React, { Component } from "react";
import './SideMenu.css';

class SideMenu extends Component {

  render() {
    let dispAcc="";
    if(true){
      dispAcc = <a href="#accounts">Accounts</a>;
    }
    let dispOp="";
    if(true){
      dispOp = <a href="#openAccount">Open an Account</a>;
    }
    let dispBS="";
    if(true){
      dispBS = <a href="#bankingStatements">Banking Statements</a>;
    }
    let dispSch="";
    if(true){
      dispSch = <a href="#scheduleMeeting">Schedule a Meeting</a>;
    }
    let dispUp="";
    if(true){
      dispUp = <a href="#updateContact">Update Contact Info</a>;
    }
    let dispMA="";
    if(true){
      dispMA = <a href="#manageAccounts">Manage Accounts</a>;
    }
    let dispMR="";
    if(true){
      dispMR = <a href="#manageRequests">Manage Requests</a>;
    }
  return (
    
    <div className="sidenav">
      {dispAcc}
      {dispOp}
      {dispBS}
      {dispSch}
      {dispUp}
      {dispMA}
      {dispMR}   
    </div>
  );
  }
}

export default SideMenu;
