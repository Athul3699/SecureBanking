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
import Scheduler from './Scheduler';
import HelpSupport from './HelpSupport';
import UpdateContact from './UpdateContact';
import BankingStatements from './BankingStatements';
import AccountHome from './AccountHome';
import UpdateContactInfo from './UpdateContactInfo';
import ManageAccountsTier2 from './ManageAccountsTier2';
  class LandingPage extends Component {

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
              <li><NavLink to="/schedule">Schedule</NavLink></li>
              <li><NavLink to="/help">Help and Support</NavLink></li>
            </ul>
            <div className="content">
                
              {/* <Route exact path="/" component={AccountSummaryCard}/> */}
              <Route exact path="/" component={AccountHome}/>
              {/* <Route exact path="/manageAccounts" component={ManageAccounts}/> */}
              <Route exact path="/manageAccounts" component={ManageAccountsAdmin}/>
              {/* <Route exact path="/manageAccounts" component={ManageAccountsTier2} /> */}
              <Route exact path="/manageRequests" component={ManageRequests}/>
              {/* <Route exact path="/updateInfo" component={UpdateContact}/> */}
              <Route exact path="/updateInfo" component={UpdateContactInfo}/>
              <Route exact path="/schedule" component={Scheduler}/>
              <Route exact path="/help" component={HelpSupport}/>
              <Route exact path="/bankingStatements" component={BankingStatements}/>
            </div>
          </div>
        </HashRouter>
      );
    }
  }

  export default LandingPage;