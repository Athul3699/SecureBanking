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
          <Route exact path="/register">
            <RegisterAccountPage></RegisterAccountPage>
          </Route>
          <Route path="/landingPage">
            <LandingPage></LandingPage>
          </Route>
          <Route path="/createbankaccount">
            <CreateBankAccount />
          </Route>
          <Route path="/transferfunds">
            <TransferFunds />
          </Route>
        </Switch>
      </Router>
    );
  }
}

export default AppRouter;
