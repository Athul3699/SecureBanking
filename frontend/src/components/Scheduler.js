import React, { Component } from "react";

class Scheduler extends Component {
  state = {};
  render() {
    return (
      <div style={{ padding: "50px" }}>
        <label for="schedule">Schedule:</label>
        <input type="date" id="schedule" name="schedule"></input>
      </div>
    );
  }
}

export default Scheduler;
