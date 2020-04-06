import React, { Component } from 'react'
import 'antd/dist/antd.css'
import './style.css'

import {
  Input,
  Button,
  Radio,
  Select,
  InputNumber,
  DatePicker
} from 'antd';
import { postRequestWithoutToken, getRequest, postRequest, getRequestWithoutToken } from '../../util/api';
import { API_URL } from '../../constants/references';

function formatNumber(value) {
  value += '';
  const list = value.split('.');
  const prefix = list[0].charAt(0) === '-' ? '-' : '';
  let num = prefix ? list[0].slice(1) : list[0];
  let result = '';
  while (num.length > 3) {
    result = `,${num.slice(-3)}${result}`;
    num = num.slice(0, num.length - 3);
  }
  if (num) {
    result = num + result;
  }
  return `${prefix}${result}${list[1] ? `.${list[1]}` : ''}`;
}

const { TextArea } = Input
const { Option } = Select

const dateFormat = 'YYYY/MM/DD';

class UpdateContactInfoTier2 extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: {},
      first_name: '',
      last_name: '',
      email: '',
      role_id: 1,
      password: '',
      date_of_birth: '',
      ssn: '',
      address1: '',
      contact: '',
      confirm_password: '',
    }
  }

  componentDidMount() {
    postRequest(`${API_URL}/api/v1/common/GetUser`).then((res) => {
      let data = res["data"]["data"]
      this.setState({
        first_name: data['first_name'],
        last_name: data['last_name'],
        email: data['email'],
        date_of_birth: data['date_of_birth'],
        ssn: data['ssn'],
        address1: data['address1'],
        contact: data['contact'],
      })
    })
  }

  setComponentSize = () => {
    this.setState({ componentSize: 'small' })
  }

  handleFirstName = (e) => {
    this.setState({ first_name: e.target.value })
  }

  handleLastName = (e) => {
    this.setState({ last_name: e.target.value })
  }

  handleEmail = (e) => {
    this.setState({ email: e.target.value })
  }

  handleContact = (e) => {
    this.setState({ contact: e.target.value })
  }

  handleAccountTypeChange = (e) => {
    this.setState({ role_id: e.target.value })
  }

  handleAddress = (e) => {
    this.setState({ address1: e.target.value })
  }

  handlePassword = (e) => {
    this.setState({ address: e.target.value })
  }

  handleAmountChange = (value) => {
    this.setState({ amount: value })
  }

  handlePassword = (e) => {
    this.setState({ password: e.target.value })
  }

  handleConfirmPassword = (e) => {
    this.setState({ confirm_password: e.target.value })
  }

  handleDobChange = (v1, v2) => {
    console.log(v1, v2)
    this.setState({ date_of_birth: v2 })
  }

  handleSsnChange = (e) => {
    this.setState({ ssn: e.target.value })
  }

  validate = () => {
    // do some form validation
    return true;
  }

  onButtonClick = () => {

    if (this.validate()) {
      let data = this.state
      delete data['confirm_password']
      postRequestWithoutToken(`${API_URL}/api/v1/common/CreateUser`, this.state)
        .then(() => {
          alert("Request for Contact Info updation sent for approval successfully.");
          this.props.history.push(`/`)
        })
        .catch(() => {
          // display error message. not needed for now, we can assume api is stable.
        })
    } else {
      // display error message
    }
  }

  render() {

    return (

      <div className="create-form-container">

        First Name:<br />
        <Input
          // parser={value => value.replace(/\$\s?|(,*)/g, '')}
          onChange={this.handleFirstName}
          value={this.state.first_name}
        />

        <br />
        <br />

                Last Name:<br />
        <Input
          onChange={this.handleLastName}
          value={this.state.last_name}
        />

        <br />
        <br />

                Email: <br />
        <Input
          onChange={this.handleEmail}
          value={this.state.email}
        />

        <br />
        <br />

        Contact Number:<br />
        <Input
          onChange={this.handleContact}
          value={this.state.contact}
        />

        <br />
        <br />

        {/* Date of Birth: <br />
        <DatePicker
          format={dateFormat}
          onChange={this.handleDobChange}
          // value={this.state.date_of_birth}
        />

        <br />
        <br /> */}

                SSN: <br />
        <Input
          onChange={this.handleSsnChange}
          value={this.state.ssn}
        />

        <br />
        <br />

        Address: <br />
        <Input
          onChange={this.handleAddress}
          value={this.state.address1}
        />

        <br />
        <br />

        Password: <br />
        <Input
          onChange={this.handlePassword}
          value={this.state.password}
        />

        <br />
        <br />

        Confirm Password: <br />
        <Input
          onChange={this.handleConfirmPassword}
          value={this.state.confirm_password}
        />

        <br />
        <br />

        <Button
          type="primary"
          onClick={this.onButtonClick}
        >
          Request for Update Of Information
        </Button>

      </div>
    );
  }
}

export default UpdateContactInfoTier2