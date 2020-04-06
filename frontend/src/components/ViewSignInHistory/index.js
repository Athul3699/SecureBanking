import React, { Component } from 'react'
import 'antd/dist/antd.css'
import './style.css'

import {
    Table,
  } from 'antd';

import { getRequest } from '../../util/api';
import { API_URL } from '../../constants/references';

class ViewSignInHistory extends Component {
    constructor(props) {
        super(props)
        this.state = {
          signinhistory: [
          ],
          error:false      
        }
    }

    componentDidMount() {
      this.refreshSignInHistoryState()
    }

    refreshSignInHistoryState = () => {
        getRequest(`${API_URL}/api/v1/admin/GetSignInHistory`)
        .then((data) => {
          this.setState({ signinhistory: data["data"]})
        })
          .catch((err) => {
            this.setState({ error: true })
            console.log(err)
          })
      .catch((err) => { 
        this.setState({ error: true })
      })
    }

    render() {
        const columns = [
          {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
          },
          {
            title: 'Reason',
            dataIndex: 'reason',
            key: 'reason',
          },
          {
            title: 'Time',
            dataIndex: 'created_time',
            key: 'created_time',
          },
        ]

        return (

            <div className="create-form-container"> 

                Sign In History:
                <br />
                <br />
                <Table dataSource={this.state.signinhistory} columns={columns} />
            </div>
        );
    }
}

export default ViewSignInHistory