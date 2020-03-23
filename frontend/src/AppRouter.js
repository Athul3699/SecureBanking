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
          <Route path="/landingPage">
            <LandingPage></LandingPage>
          </Route>
        </Switch>
      </Router>
    );
  }
}

export default AppRouter;
