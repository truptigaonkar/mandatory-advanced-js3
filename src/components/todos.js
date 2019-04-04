import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import jwt from 'jsonwebtoken'
import { token$, updateToken } from '../store'

export default class Todos extends Component {

  constructor(props) {
    super(props);
    this.state = {
      todo: null,
      token: token$.value,
      email: ''
    }
  }

  // Getting profile (email) information
  componentDidMount() {
    if (!!this.state.token) {
      const decoded = jwt.decode(token$.value);
      console.log("Decoded email: ", decoded.email);
      this.setState({ email: decoded.email })
    } else {
      this.props.history.push("/login");
    }
  }

  componentWillUnmount() {
    updateToken(null);
  }

  // Handling logout button
  handleLogout(e) {
    e.preventDefault();
    updateToken(null);
    this.props.history.push("/login");
  }

  render() {
    console.log("Email inside render: ", this.state.email);
    return (
      <>
        <Helmet>
          <title>Todos</title>
        </Helmet>

        <p>Welcome User, {this.state.email} <button type="button" onClick={this.handleLogout.bind(this)}>todos.js Logout</button></p>

        <h1>Todo list</h1>

      </>
    )
  }
}
