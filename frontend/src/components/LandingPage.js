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


import ManageAccountsAdmin from './ManageAccountsAdmin';
import ManageAccountsTier2 from './ManageAccountsTier2';
import ManageAccountsTier1 from './ManageAccountsTier1';
import ManageAccountsIndividualUser from './ManageAccountsIndividualUser';
import ManageAccountsMerchant from './ManageAccountsMerchant';


import {  getRequest, postRequest } from '../util/api';
import { API_URL } from '../constants/references';
import UpdateContactInfoIndividualUser from './UpdateContactInfoIndividualUser';
import UpdateContactInfoMerchant from './UpdateContactInfoMerchant';
import UpdateContactInfoTier1 from './UpdateContactInfoTier1';
import UpdateContactInfoTier2 from './UpdateContactInfoTier2';
import ViewSignInHistory from './ViewSignInHistory';

import { withRouter } from "react-router-dom"
import { Button } from 'antd';



  class LandingPage extends Component {
    constructor(props) {
      super(props)
      this.state = {
        roleId:-1,
        isAuthorized: false,   
      }
    }

    componentDidMount(){
      this.refreshState()
    }

    refreshState = () => {
      if (window.localStorage.getItem('API_TOKEN')) {
        getRequest(`${API_URL}/api/v1/auth/GetRole`)
        .then((data) => {
            console.log("This is the data...", data)
            if(data.status === "success"){
              this.setState({roleId: data.roleId})
              this.setState({ isAuthorized: true })
            }
            else{
              console.log("token invalid");
              this.setState({ isAuthorized: false })
            }

          })
          .catch((err) => {
            console.error(err)
            this.setState({ isAuthorized: false })
          })
        } else {
          this.setState({ isAuthorized: false })
        }
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

    getManageAccountsPage(){
      if(this.state.roleId===1) {
        return ManageAccountsIndividualUser;
      }
      if(this.state.roleId===2) {
        return ManageAccountsMerchant;
      }
      if(this.state.roleId===3) {
        return ManageAccountsTier1;
      }
      if(this.state.roleId===4) {
        return ManageAccountsTier2;
      }
      if(this.state.roleId===5) {
        return ManageAccountsAdmin;
      }
    }

    getContactInfoPage() {
      if(this.state.roleId===1) {
        return UpdateContactInfoIndividualUser;
      }
      if(this.state.roleId===2) {
        return UpdateContactInfoMerchant
      }
      if(this.state.roleId===3) {
        return UpdateContactInfoTier1;
      }
      if(this.state.roleId===4) {
        return UpdateContactInfoTier2;
      }
      if(this.state.roleId===5) {
        return ManageAccountsAdmin;
      }
    }

    logout = () => {
      postRequest(`${API_URL}/api/v1/auth/LogoutUser`)
      .then((data) => {
        window.localStorage.removeItem('API_TOKEN')
        this.refreshState()
        this.goToLogin();
        })
        .catch((err) => {
          console.error(err)
        })
    }

    goToLogin = () => {
      this.props.history.push('')
    }

    render() {
      if (this.state.isAuthorized) {
        return (
            <HashRouter>
              <div>
                <h1>Account</h1>
                <ul className="header">
                  {this.state.roleId < 3 ? <li><NavLink to="/">Home</NavLink></li> : <li></li>}
                  {this.state.roleId < 3 ? <li><NavLink to="/bankingStatements">Banking Statements</NavLink></li> : <li></li>}
                  <li><NavLink to="/manageAccounts">Manage Accounts</NavLink></li>
                  <li><NavLink to="/manageRequests">Manage Requests</NavLink></li>
                  <li><NavLink to="/updateInfo">Update Contact Info</NavLink></li>
                  {this.state.roleId < 3 ? <li><NavLink to="/schedule">Schedule Appointment</NavLink></li> : <li></li>}
                  {this.state.roleId < 3 ? <li><NavLink to="/help">Help and Support</NavLink></li> : <li></li>}
                  <li><NavLink to="/signinhistory">Sign In History</NavLink></li> 
                  <li> <Link  onClick={() => this.logout()} exact path="/"> Logout </Link> </li>
                </ul>
                <div className="content">
                    
                  {/* <Route exact path="/" component={AccountSummaryCard}/> */}
                  {this.state.roleId < 3 ? <Route exact path="/" component={AccountHome}/> : <Route exact path="/" component={this.getManageAccountsPage()}/>}
                  {/* <Route exact path="/manageAccounts" component={ManageAccounts}/> */}
                  <Route exact path="/manageAccounts" component={this.getManageAccountsPage()}/>
                  {/* <Route exact path="/manageAccounts" component={ManageAccountsTier2} /> */}
                  <Route exact path="/manageRequests" component={this.getRequestPage()}/>
                  {/* <Route exact path="/updateInfo" component={UpdateContact}/> */}
                  <Route exact path="/updateInfo" component={this.getContactInfoPage()}/>
                  {this.state.roleId < 3 ? <Route exact path="/schedule" component={ScheduleAppointment}/> : <Route exact path="/schedule" component={this.getManageAccountsPage()}/>}
                  {this.state.roleId < 3 ? <Route exact path="/help" component={HelpSupport}/> : <Route exact path="/help" component={this.getManageAccountsPage()}/>}
                  {this.state.roleId < 3 ? <Route exact path="/bankingStatements" component={BankingStatements}/> : <Route exact path="/bankingStatements" component={this.getManageAccountsPage()}/>}
                  <Route exact path="/signinhistory" component={ViewSignInHistory}/>
                </div>
              </div>
            </HashRouter>
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

  export default withRouter(LandingPage);