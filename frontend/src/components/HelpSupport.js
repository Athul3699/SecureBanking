import React, { Component } from "react";


import './HelpSupport.css';



class HelpSupport extends Component {
  constructor(props) {
    super(props);
    this.state = {

      feedback:'',
      accType:'',
      startDate: new Date()
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChange(event){

    this.setState({ [event.target.name]: event.target.value });
    console.log(event.target.name); // the name of the form element
    console.log(event.target.value); // the value of the form element
  }

  handleSubmit(event) {
    

  }
  render() {
  return ( 
    <div className='mng'>  
      <div className='hs'>  
      <p className="hs-header">Help &amp; Support</p>
      <label>Feedback/Report Problem&nbsp;&nbsp;</label>
      <form onSubmit={this.handleSubmit}>
        <textarea  style={{ resize: "none", height: "120px" }} name="feedback" value={this.state.feedback} onChange={this.handleChange} />
        <div className="hs-button"><input type="submit" value="Submit" /></div>
      </form>
        

</div>  
</div>  
  );
  }
}

export default HelpSupport;
