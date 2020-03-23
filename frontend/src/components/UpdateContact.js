import React from "react";
import Popup from "reactjs-popup";
import { postRequest } from "../util/api"
import { API_URL } from "../constants/references";

class UpdateContact extends React.Component {
  constructor(props) {
    super(props);
    this.state = { contactNumber: "", address: "", password: "" };

    this.handleChange = this.handleChange.bind(this);
    this.handleChangeAddress = this.handleChangeAddress.bind(this);
    this.handleSubmitContact = this.handleSubmitContact.bind(this);
    this.handleSubmitAddress = this.handleSubmitAddress.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleSubmitPassword = this.handleSubmitPassword.bind(this);
  }

  handleChange(event) {
    this.setState({ contactNumber: event.target.value });
  }

  handleChangeAddress(event) {
    this.setState({ address: event.target.value });
  }

  handleChangePassword(event) {
    this.setState({ password: event.target.value });
  }

  handleSubmitContact(event) {
    postRequest(`${API_URL}/api/v1/user/InitiateModifyUser`, { edit_data: { contact: this.state.contactNumber }})
    .then(() => alert("The new contact has been sent for approval: " + this.state.contactNumber))
    .catch(() => console.error("Failure..."))
  }

  handleSubmitAddress(event) {
    alert("New Address has been sent for approval: " + this.state.address);
    postRequest(`${API_URL}/api/v1/user/InitiateModifyUser`, { edit_data: { address1: this.state.address } })
    .then(() => alert("New Address has been sent for approval: " + this.state.address))
    .catch(() => console.error("Failure..."))
  }

  handleSubmitPassword(event) {
    postRequest(`${API_URL}/api/v1/user/InitiateModifyUser`, { edit_data: { password: this.state.password } })
    .then(() => alert("Password change request submitted!"))
    .catch(() => console.error("Failure..."))
  }

  render() {
    return (
      <div>
        <h1>
          <h2
            style={{
              fontWeight: "bold",
              marginRight: "110px",
              paddingTop: "10px"
            }}
          >
            Update Personals
          </h2>
        </h1>

        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <div>
          <Popup
            trigger={
              <button
                type="button"
                class="btn btn-outline-primary"
                style={{
                  marginLeft: "300px",
                  paddingLeft: "100px",
                  paddingRight: "100px"
                }}
              >
                Update Contact
              </button>
            }
            position="right center"
          >
            <div
              className="ui container"
              style={{
                borderStyle: "solid",
                padding: "50px",
                flex: "3",
                flexDirection: "row",
                backgroundColor: "snow"
              }}
            >
              <div>
                <label style={{ fontWeight: "bold" }}>
                  Contact Number:
                  <input
                    className="number"
                    type="text"
                    placeholder="123-456-7890"
                    style={{
                      flex: "1"
                    }}
                    value={this.state.contactNumber}
                    onChange={this.handleChange}
                  />
                </label>

                <button
                  className="btn"
                  onClick={this.handleSubmitContact}
                  style={{
                    borderStyle: "solid",
                    backgroundColor: "green"
                  }}
                >
                  Update Contact
                </button>
              </div>
            </div>
          </Popup>
        </div>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <div>
          <Popup
            trigger={
              <button
                type="button"
                class="btn btn-outline-success"
                style={{
                  marginLeft: "300px",
                  paddingLeft: "100px",
                  paddingRight: "100px"
                }}
              >
                Update Address
              </button>
            }
            position="right center"
          >
            <div
              className="ui container"
              style={{
                borderStyle: "solid",
                padding: "50px",
                flex: "3",
                flexDirection: "row",
                backgroundColor: "lightcyan	",
                paddingTop: "50px"
              }}
            >
              <div
                style={{ paddingTop: "50px" }}
              >
                <label style={{ fontWeight: "bold" }}>
                  New Address:
                  <input
                    type="text"
                    placeholder="Street No, City, State,Zip code"
                    value={this.state.address}
                    onChange={this.handleChangeAddress}
                  />
                </label>

                <button
                  className="btn"
                  onClick={this.handleSubmitAddress}
                  style={{
                    borderStyle: "solid",
                    backgroundColor: "green"
                  }}
                >
                  Update Address
                </button>
              </div>
            </div>
          </Popup>
        </div>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <div>
          <Popup
            trigger={
              <button
                type="button"
                class="btn btn-outline-danger"
                style={{
                  marginLeft: "300px",
                  paddingLeft: "100px",
                  paddingRight: "100px"
                }}
              >
                Change Password
              </button>
            }
            position="right center"
          >
            <div
              className="ui container"
              style={{
                borderStyle: "solid",
                padding: "50px",
                flex: "3",
                flexDirection: "row",
                backgroundColor: "lightcyan	",
                paddingTop: "50px"
              }}
            >
              <div
                style={{ paddingTop: "50px" }}
              >
                <label style={{ fontWeight: "bold" }}>
                  New Password:
                  <input
                    type="password"
                    value={this.state.password}
                    onChange={this.handleChangePassword}
                  />
                </label>
                <label style={{ fontWeight: "bold" }}>
                  Confirm Password:
                  <input type="password" />
                </label>

                <button
                  className="btn"
                  onClick={this.handleSubmitPassword}
                  style={{
                    borderStyle: "solid",
                    backgroundColor: "green"
                  }}
                >
                  Update Password
                </button>
              </div>
            </div>
          </Popup>
        </div>
      </div>
    );
  }
}

export default UpdateContact;
