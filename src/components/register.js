import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import axios from 'axios'

class Register extends Component {

  constructor(props){
    super(props);
    this.state ={
      email: '',
      password: '',
      message:''
    }
  }

  /* handleEmailChange(e){
    this.setState({ email: e.target.value });
  }

  handlePasswordChange(e){
    this.setState({ password: e.target.value });
  } */

  // Same as above commented statements but more suitable
  // Handling all inputs
  handleChange(e){
    this.setState({ [e.target.name]: e.target.value })
  }

  // Handling register form
  handleFormSubmit(e){
    e.preventDefault();
    const userData = {
      email: this.state.email,
      password: this.state.password
    }
    let API_ROOT = "http://ec2-13-53-32-89.eu-north-1.compute.amazonaws.com:3000";
    axios.post(API_ROOT + "/register", userData)
    .then((response) => {
      console.log(response);
      if(response.status === 201){
        this.props.history.push("/register");
        this.setState({ message: "You have been registered successfully. Please login now" });
      }
    })
    .catch((error) => {
      if (error.response && error.response.status === 400) {
      this.setState({ message: "Something went wrong !!!!" });
      }
    });
  }

  render() {
    //console.log(this.state);
    return (
      <div>
      <Helmet>
          <title>Register</title>
        </Helmet>
        <h1>register</h1>
        <div className="message">{this.state.message}</div> {/* erroror messsage */}
        <form onClick={this.handleFormSubmit.bind(this)}>
          <label>Email</label>
          {/* <input type="email" value={this.state.email} onChange={this.handleEmailInput.bind(this)} /> <br/> */}
          <input type="email" name="email" value={this.state.email} onChange={this.handleChange.bind(this)} /> <br/>
          <label>Password</label>
          {/* <input type="password" value={this.state.password} onChange={this.handlePasswordInput.bind(this)} /> <br/> */}
          <input type="password" name="password" value={this.state.password} onChange={this.handleChange.bind(this)} /> <br/>
          <button type="submit">Register</button>
        </form>
      </div>
    )
  }
}

export default Register

