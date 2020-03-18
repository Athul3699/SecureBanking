import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import React, { Component } from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useRouteMatch,
    useParams
  } from "react-router-dom";
// Be sure to include styles at some point, probably during your bootstraping
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import AccountSummaryCard from "./AccountSummaryCard";
import ManageAccount from "./ManageAccounts";
import Scheduler from "./Scheduler";
import ManageRequests from "./ManageRequests";
class Side extends Component {
    state = {};
    render() {
      return (
<Router>
    <Route render={({ location, history }) => (
        <React.Fragment>
            <SideNav
                onSelect={(selected) => {
                    const to = '/' + selected;
                    if (location.pathname !== to) {
                        history.push(to);
                    }
                }}
            >
                <SideNav.Toggle />
                <SideNav.Nav defaultSelected="accounts">
                    <NavItem eventKey="menu/accounts">
                        <NavIcon>
                            <i className="fa fa-fw fa-home" style={{ fontSize: '1.75em' }} />
                        </NavIcon>
                        <NavText>
                            Accounts
                        </NavText>
                    </NavItem>
                    <NavItem eventKey="menu/openAccount">
                        <NavIcon>
                            <i className="fa fa-fw fa-device" style={{ fontSize: '1.75em' }} />
                        </NavIcon>
                        <NavText>
                            Open Account
                        </NavText>
                    </NavItem>
                    <NavItem eventKey="menu/bankingStatements">
                        <NavIcon>
                            <i className="fa fa-fw fa-device" style={{ fontSize: '1.75em' }} />
                        </NavIcon>
                        <NavText>
                            Banking Statements
                        </NavText>
                    </NavItem>
                    <NavItem eventKey="menu/scheduleMeeting">
                        <NavIcon>
                            <i className="fa fa-fw fa-device" style={{ fontSize: '1.75em' }} />
                        </NavIcon>
                        <NavText>
                            Schedule Meetings
                        </NavText>
                    </NavItem>
                    <NavItem eventKey="menu/updateContact">
                        <NavIcon>
                            <i className="fa fa-fw fa-device" style={{ fontSize: '1.75em' }} />
                        </NavIcon>
                        <NavText>
                            Update Contact
                        </NavText>
                    </NavItem>
                    <NavItem eventKey="menu/manageAccounts">
                        <NavIcon>
                            <i className="fa fa-fw fa-device" style={{ fontSize: '1.75em' }} />
                        </NavIcon>
                        <NavText>
                            Manage Accounts
                        </NavText>
                    </NavItem>
                    <NavItem eventKey="menu/manageRequests">
                        <NavIcon>
                            <i className="fa fa-fw fa-device" style={{ fontSize: '1.75em' }} />
                        </NavIcon>
                        <NavText>
                            Manage Requests
                        </NavText>
                    </NavItem>
                    <NavItem eventKey="menu/helpSupport">
                        <NavIcon>
                            <i className="fa fa-fw fa-device" style={{ fontSize: '1.75em' }} />
                        </NavIcon>
                        <NavText>
                            Help and Support
                        </NavText>
                    </NavItem>
                </SideNav.Nav>
            </SideNav>
            <main>
                <Route path="/" exact component={props => <AccountSummaryCard />} />
                <Route path="/menu/accounts" component={props => <AccountSummaryCard />} />
                <Route path="/menu/manageAccounts" component={props => <ManageAccount />} />
                <Route path="/menu/manageRequests" component={props => <ManageRequests />} />
                <Route path="/menu/scheduleMeeting" component={props => <Scheduler />} />
            </main>
        </React.Fragment>
    )}
    />
</Router>   
      );
            }
        }

        export default Side;