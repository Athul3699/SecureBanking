import React, { Component } from "react";
import Select from 'react-select';
import "./App.css";

const emailRegex = RegExp(
  /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
);

const userType = [
  { label: "Individual", value: 1 },
  { label: "Merchant", value: 2 },
  { label: "Tier1", value: 3 },
  { label: "Tier2", value: 4 },
  { label: "Tier3", value: 5 },
];

const formValid = ({ formErrors, ...rest }) => {
  let valid = true;

  // validate form errors being empty
  Object.values(formErrors).forEach(val => {
    val.length > 0 && (valid = false);
  });

  // validate the form was filled out
  Object.values(rest).forEach(val => {
    val === null && (valid = false);
  });

  return valid;
};

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firstName: null,
      lastName: null,
      email: null,
      password: null,
      contactNumber: null,
      address1: null,
      address2: null,
      userType: null,
      formErrors: {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        contactNumber: "",
        address1: "",
        address2: ""
      }
    };
  }

  handleSubmit = e => {
    e.preventDefault();

    if (formValid(this.state)) {
      var accountDetails = {
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        email: this.state.email,
        contactNumber: this.state.contactNumber,
        address1: this.state.address1,
        address2: this.state.address2,
        password: this.state.password,
        userType: this.state.userType
      };
      console.log(accountDetails);

      //Call the backend api....

    } else {
      console.error("FORM INVALID - DISPLAY ERROR MESSAGE");
      alert("Please fill all the fields");
    }
  };

  handleChange1 = e => {
    console.log(e);
    this.setState({ userType: e.value });
  }

  handleChange = e => {
    e.preventDefault();
    const { name, value } = e.target;
    let formErrors = { ...this.state.formErrors };

    switch (name) {
      case "firstName":
        formErrors.firstName =
          value.length < 2 ? "minimum 2 characaters required" : "";
        break;
      case "lastName":
        formErrors.lastName =
          value.length < 1 ? "minimum 1 characaters required" : "";
        break;
      case "email":
        formErrors.email = emailRegex.test(value)
          ? ""
          : "invalid email address";
        break;
      case "contactNumber":
        formErrors.contactNumber =
          value.length < 10 || isNaN(value)? "Enter Valid Number" : "";
        break;
      case "address1":
        formErrors.address1 = value.length < 4 ? "Enter valid address" : "";
        break;
      case "address2":
        formErrors.address2 = value.length < 3 ? "Enter valid address" : "";
        break;
      case "password":
        formErrors.password =
          value.length < 7 ? "minimum 7 characaters required" : "";
        break;
      default:
        break;
    }

    this.setState({ formErrors, [name]: value }, () => console.log(this.state));
  };

  render() {
    const { formErrors } = this.state;

    return (
      <div className="wrapper">
        <div className="form-wrapper">
          <h1>Create Account</h1>
          <form onSubmit={this.handleSubmit} noValidate>
            <div className="firstName">
              <label htmlFor="firstName">First Name</label>
              <input
                className={formErrors.firstName.length > 0 ? "error" : null}
                placeholder="First Name"
                type="text"
                name="firstName"
                onChange={this.handleChange}
              />
              {formErrors.firstName.length > 0 && (
                <span className="errorMessage">{formErrors.firstName}</span>
              )}
            </div>
            <div className="lastName">
              <label htmlFor="lastName">Last Name</label>
              <input
                className={formErrors.lastName.length > 0 ? "error" : null}
                placeholder="Last Name"
                type="text"
                name="lastName"
                onChange={this.handleChange}
              />
              {formErrors.lastName.length > 0 && (
                <span className="errorMessage">{formErrors.lastName}</span>
              )}
            </div>
            <div className="email">
              <label htmlFor="email">Email</label>
              <input
                className={formErrors.email.length > 0 ? "error" : null}
                placeholder="Email"
                type="email"
                name="email"
                onChange={this.handleChange}
              />
              {formErrors.email.length > 0 && (
                <span className="errorMessage">{formErrors.email}</span>
              )}
            </div>

            <div className="contactNumber">
              <label htmlFor="contactNumber">Contact Number</label>
              <input
                className={formErrors.contactNumber.length > 0 ? "error" : null}
                placeholder="123-456-7890"
                type="text"
                name="contactNumber"
                onChange={this.handleChange}
              />
              {formErrors.contactNumber.length > 0 && (
                <span className="errorMessage">{formErrors.contactNumber}</span>
              )}
            </div>

            <div className="userType">
            <label htmlFor="userType">User Type</label>
            <div className="container">
            <div className="row">
              <div className="col-md-4"></div>
              <div className="col-md-4">
                <Select options={ userType } 
                onChange={this.handleChange1}
                />
              </div>
              <div className="col-md-4"></div>
            </div>
            </div>
            </div>

            <div className="address1">
              <label htmlFor="address1">Address1</label>
              <input
                className={formErrors.address1.length > 0 ? "error" : null}
                placeholder="Street No, Apt, City"
                type="text"
                name="address1"
                onChange={this.handleChange}
              />
              {formErrors.address1.length > 0 && (
                <span className="errorMessage">{formErrors.address1}</span>
              )}
            </div>

            <div className="address2">
              <label htmlFor="address2">Address2</label>
              <input
                className={formErrors.address2.length > 0 ? "error" : null}
                placeholder="State, Country, Zip"
                type="text"
                name="address2"
                onChange={this.handleChange}
              />
              {formErrors.address2.length > 0 && (
                <span className="errorMessage">{formErrors.address2}</span>
              )}
            </div>

            <div className="password">
              <label htmlFor="password">Password</label>
              <input
                className={formErrors.password.length > 0 ? "error" : null}
                placeholder="Password"
                type="password"
                name="password"
                onChange={this.handleChange}
              />
              {formErrors.password.length > 0 && (
                <span className="errorMessage">{formErrors.password}</span>
              )}
            </div>
            <div className="createAccount">
              <button type="submit">Create Account</button>
              <small>Already Have an Account?</small>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default App;
