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
import LandingPage from "./components/LandingPage";
import CreateBankAccount from "./components/CreateBankAccount";
import TransferFunds from "./components/TransferFunds";
import CreateUserAccount from "./components/CreateUserAccount";
import ForgotUserPassword from "./components/ForgotUserPassword";
import ResetUserPassword from "./components/ResetUserPassword";
import CreateEmployeeAccount from "./components/CreateEmployeeAccountAdminPage";
import CreateEmployeeAccountTier2 from "./components/CreateEmployeeAccountTier2";
import { Button } from "antd";
import { postRequest } from "./util/api";
import { API_URL } from "./constants/references";


class AppRouter extends Component {

  state = {};

  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/">
            <Login></Login>
          </Route>
          <Route path="/createuseraccount">
            <CreateUserAccount />
          </Route>
          <Route path="/forgotuserpassword">
            <ForgotUserPassword />
          </Route>
          <Route path="/resetuserpassword">
            <ResetUserPassword />
          </Route>
          <Route exact path="/register">
            <RegisterAccountPage></RegisterAccountPage>
          </Route>
          <Route path="/landingPage">
            <LandingPage></LandingPage>
          </Route>
          <Route path="/createbankaccount">
            <CreateBankAccount />
          </Route>

          <Route path="/createt1employeeaccount">
            <CreateEmployeeAccount />
          </Route>

          <Route path="/createt2employeeaccount">
            <CreateEmployeeAccountTier2 />
          </Route>

          <Route path="/transferfunds">
            <TransferFunds />
          </Route>

          <Route path="/logout">
            <Button onClick={() => this.logoutUser()}> Logout </Button>
          </Route>
        </Switch>
      </Router>
    );
  }
}

export default AppRouter;
