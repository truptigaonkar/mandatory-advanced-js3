import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import axios from 'axios'
import { updateToken } from "../store";

export default class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      message: ''
    }
  }

  // Handling all inputs
  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  // Handling register form
  handleFormSubmit(e) {
    e.preventDefault();
    const userData = {
      email: this.state.email,
      password: this.state.password
    }

    // Necessary step to perform
    this.source = axios.CancelToken.source();

    let API_ROOT = "http://ec2-13-53-32-89.eu-north-1.compute.amazonaws.com:3000";

    axios.post(API_ROOT + "/auth", userData, { cancelToken: this.source.token })
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          updateToken(response.data.token); // Token
          window.localStorage.setItem("token", response.data.token)  // Saving token in localStorage
          this.props.history.push("/todos");
          //this.setState({ message: "Login successfully" });
        }
      })
      .catch((error) => {
        if (!axios.isCancel(error)) {
          this.setState({ message: "Something went wrong !!!!" });
        }
      });

  }

  // Necessary step to perform
  componentWillUnmount() {
    if (this.source) {
      this.source.cancel();
    }
  }

  render() {
    //console.log(this.state);
    return (
      <>
        <Helmet>
          <title>Login</title>
        </Helmet>
        <h1>Login</h1>
        <div className="message">{this.state.message}</div> {/* erroror messsage */}
        <form onSubmit={this.handleFormSubmit.bind(this)}>
          <label>Email</label>
          <input type="email" name="email" value={this.state.email} onChange={this.handleChange.bind(this)} /><br />
          <label>Password</label>
          <input type="password" name="password" value={this.state.password} onChange={this.handleChange.bind(this)} /><br />
          <button type="submit">Submit</button>
        </form>
      </>
    )
  }
}
