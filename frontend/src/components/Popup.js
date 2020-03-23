import React from 'react';  
import './Popup.css';  
import { postRequest } from '../util/api';
import { API_URL } from '../constants/references';

class Popup extends React.Component {  
  constructor(props) {
    super(props);

    this.state = {


    };
  }
  displayMessage(message) {
    console.log(message)
  }

  handleApprove = () => {
    postRequest(`${API_URL}/api/v1/admin/ManageRequest`, { edit_status: 2 })
    .then(() => alert('Approved!'))
    .then(() => console.error('Something went wrong...'))
  }

  handleDecline = () => {
    postRequest(`${API_URL}/api/v1/admin/ManageRequest`, { edit_status: 3 })
    .then(() => alert('Declined!'))
    .then(() => console.error('Something went wrong...'))
  }

  render() {  
    var obj = JSON.parse(this.props.text);
    let dispMA_del="";
    let dispMA_edt="";
    if(this.props.page==="dispMA"){
      dispMA_del = <button onClick={this.handleDelete} className="button">Delete</button> ;
      dispMA_edt = <button onClick={this.handleEdit} className="button">Edit</button>  ;
    }
    let dispMR_app="";
    let dispMR_dec="";
    if(this.props.page==="dispMR"){
      dispMR_app = <button onClick={this.handleApprove} className="button">Approve</button> ;
      dispMR_dec = <button onClick={this.handleDecline} className="button">Decline</button>  ;
    }
    

    
return (  

<div className='popup'>  
<div className='popup-inner'>  

<p>ID: {obj.id}</p>  
<p>Name: {obj.name}</p>  
<p>Age: {obj.age}</p>  
<p>email: {obj.email}</p>
<p>{obj.content}</p>
</div>
<div className="popup-buttons">
  {dispMA_del}
  {dispMA_edt}
  {dispMR_app}  
  {dispMR_dec}
<button className="button" onClick={this.props.closePopup}>Go Back</button>  

</div>  
</div>  
);  
}  
}  

export default Popup;