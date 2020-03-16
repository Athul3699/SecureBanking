import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import AccountSummaryCard from "./AccountSummaryCard";
import Scheduler from "./Scheduler";

class Home extends Component {
  state = {};
  render() {
    return (
      <Router>
        <div style={{ display: "flex", alignContent: "flex-start" }}>
          <ul>
            <li>
              <Link to="/home/base">Home</Link>
            </li>
            <li>
              <Link to="/home/dashboard">Accounts</Link>
            </li>
            <li>
              <Link to="/home/open_an_account">Open an account</Link>
            </li>
            <li>
              <Link to="/home/Banking_statements">Banking Statetments</Link>
            </li>
            <li>
              <Link to="/home/about">Schedule a meeting</Link>
            </li>
            <li>
              <Link to="/home/update_info">Update Contact Info</Link>
            </li>
          </ul>

          <Switch>
            <Route exact path="/home/base">
              <div>Base home</div>
            </Route>
            <Route path="/home/about">
              <Scheduler></Scheduler>
            </Route>
            <Route path="/home/dashboard">
              <AccountSummaryCard></AccountSummaryCard>
            </Route>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default Home;
