import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
} from "react-router-dom";
import RegisterAccountPage from "./components/RegisterAccountPage";
import Login from "./Login";
import AccountSummaryCard from "./components/AccountSummaryCard";
import ManageAccount from "./components/ManageAccounts";
import Scheduler from "./components/Scheduler";
import SideMenu from "./components/SideMenu";
import ManageRequests from "./components/ManageRequests";
import List from "./components/List";

class AppRouter extends Component {
  state = {};
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/">
            <Login></Login>
          </Route>
          <Route exact path="/register">
            <RegisterAccountPage></RegisterAccountPage>
          </Route>
          <Route exact path="/accounts">
            <AccountSummaryCard></AccountSummaryCard>
          </Route>
          <Route exact path="/sidemenu">
            <SideMenu></SideMenu>
          </Route>
          <Route exact path="/manageAccounts">
            <ManageAccount></ManageAccount>
          </Route>
          <Route path="/manageRequests">
            <ManageRequests></ManageRequests>
          </Route>
          <Route path="/menu">
            <SideMenu></SideMenu>
          </Route>
          <Route path="/list">
            <List></List>
          </Route>
        </Switch>
      </Router>
    );
  }
}

export default AppRouter;
