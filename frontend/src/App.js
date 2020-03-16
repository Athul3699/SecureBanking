import React, { Component } from "react";
import "./App.css";
import RegisterAccountPage from "./components /RegisterAccountPage";
import AppRouter from "./AppRouter";
import "bootstrap/dist/css/bootstrap.min.css";

class App extends Component {
  render() {
    return <AppRouter></AppRouter>;
  }
}

export default App;
