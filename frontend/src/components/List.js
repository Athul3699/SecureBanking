import React, { Component } from "react";
import './List.css';
import Popup from './Popup';
class List extends Component {
  constructor(props) {
    super(props) 
    this.state = {
       list: [
          { id: 1, name: 'Wasif', age: 21, email: 'wasif@email.com', content: 'Request: delete account' },
          { id: 2, name: 'Ali', age: 19, email: 'ali@email.com', content: 'Request: transfer funds' },
          { id: 3, name: 'Saad', age: 16, email: 'saad@email.com', content: 'Request: update contact info' },
          { id: 4, name: 'Asad', age: 25, email: 'asad@email.com', content: 'Request: transfer funds' }
       ],
       showPopup: false,
       detail :'',

    }
 }

 displayMessage(message) {
  console.log(message)
}

 togglePopup(param) {  
  this.setState({  
       showPopup: !this.state.showPopup,
       detail:param
  });  
  this.displayMessage('dd');
   }

    renderTableHeader() {
      let keysToRender = ['id', 'name', 'email', 'content'];
      let header = Object.keys(this.state.list[0]).filter(key => { return ~keysToRender.indexOf(key) })
      return header.map((key, index) => {
         return <th key={index}>{key.toUpperCase()}</th>
      })
   }
  
   renderTableData() {
    return this.state.list.map((list, index) => {
       const { id, name, age, email } = list 
       return (
          <tr key={id}>
             <td>{id}</td>
             <td>{name}</td>
             <td>{email}</td>
             <td><button onClick={this.togglePopup.bind(this,JSON.stringify(list))}> View</button></td>

          </tr>
       )
    })
  }
   render() {
      return (
        
         <div className="list">
            {this.state.showPopup ?  
<Popup    
          page={this.props.page}
          text={this.state.detail}
          closePopup={this.togglePopup.bind(this)}  
/>  
: null  
}
            <table id='data'>
               <tbody>
                  <tr>{this.renderTableHeader()}</tr>
                  {this.renderTableData()}
               </tbody>
            </table>
         </div>
      )
   }
}

export default List;
