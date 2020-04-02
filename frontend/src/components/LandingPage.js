import React, { Component } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    NavLink,
    HashRouter,
    useRouteMatch,
    useParams
  } from "react-router-dom";
import AccountSummaryCard from './AccountSummaryCard';
import ManageAccountsAdmin from './ManageAccountsAdmin';
import ManageRequests from './ManageRequests';
import "./LandingPage.css";
import ScheduleAppointment from './ScheduleAppointment';
import HelpSupport from './HelpSupport';
import UpdateContact from './UpdateContact';
import BankingStatements from './BankingStatements';
import AccountHome from './AccountHome';
import UpdateContactInfo from './UpdateContactInfo';
import ManageRequestsAdmin from './ManageRequestsAdmin';
import ManageRequestsMerchant from './ManageRequestsMerchant';
import ManageRequestsIndividualUser from'./ManageRequestsIndividualUser';
import ManageRequestsTier1 from './ManageRequestsTier1';
import ManageRequestsTier2 from './ManageRequestsTier2';
import {  getRequest } from '../util/api';
import { API_URL } from '../constants/references';
  class LandingPage extends Component {
    constructor(props) {
      super(props)
      this.state = {
        roleId:-1,      
      }
    }

    componentDidMount(){
      getRequest(`${API_URL}/api/v1/auth/GetRole`)
      .then((data) => {
          if(data.status==="success"){
            this.setState({roleId: data.roleId})
          }
          else{
            console.log("token invalid");
          }

        })
        .catch((err) => {
          console.error(err)
        })
    }

    getRequestPage(){
      if(this.state.roleId===1){
        return ManageRequestsIndividualUser;
      }
      if(this.state.roleId===2){
        return ManageRequestsMerchant;
      }
      if(this.state.roleId===3){
        return ManageRequestsTier1;
      }
      if(this.state.roleId===4){
        return ManageRequestsTier2;
      }
      if(this.state.roleId===5){
        return ManageRequestsAdmin;
      }
    }

    render() {
      return (
        <HashRouter>
          <div>
            <h1>Account</h1>
            <ul className="header">
              <li><NavLink to="/">Home</NavLink></li>
              <li><NavLink to="/bankingStatements">Banking Statements</NavLink></li>
              <li><NavLink to="/manageAccounts">Manage Accounts</NavLink></li>
              <li><NavLink to="/manageRequests">Manage Requests</NavLink></li>
              <li><NavLink to="/updateInfo">Update Contact Info</NavLink></li>
              <li><NavLink to="/schedule">Schedule Appointment</NavLink></li>
              <li><NavLink to="/help">Help and Support</NavLink></li>
            </ul>
            <div className="content">
                
              {/* <Route exact path="/" component={AccountSummaryCard}/> */}
              <Route exact path="/" component={AccountHome}/>
              {/* <Route exact path="/manageAccounts" component={ManageAccounts}/> */}
              <Route exact path="/manageAccounts" component={ManageAccountsAdmin}/>
              {/* <Route exact path="/manageAccounts" component={ManageAccountsTier2} /> */}
              <Route exact path="/manageRequests" component={this.getRequestPage()}/>
              {/* <Route exact path="/updateInfo" component={UpdateContact}/> */}
              <Route exact path="/updateInfo" component={UpdateContactInfo}/>
              <Route exact path="/schedule" component={ScheduleAppointment}/>
              <Route exact path="/help" component={HelpSupport}/>
              <Route exact path="/bankingStatements" component={BankingStatements}/>
            </div>
          </div>
        </HashRouter>
      );
    }
  }

  export default LandingPage;