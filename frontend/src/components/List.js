import React, { Component } from "react";
import './List.css';

class List extends Component {
  constructor(props) {
    super(props) 
    this.state = {
       list: [
          { id: 1, name: 'Wasif', age: 21, email: 'wasif@email.com' },
          { id: 2, name: 'Ali', age: 19, email: 'ali@email.com' },
          { id: 3, name: 'Saad', age: 16, email: 'saad@email.com' },
          { id: 4, name: 'Asad', age: 25, email: 'asad@email.com' }
       ]
    }
 }

    renderTableHeader() {
      let header = Object.keys(this.state.list[0])
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
             <td>{age}</td>
             <td>{email}</td>
          </tr>
       )
    })
  }
   render() {
      return (
         <div className="list">
            
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
