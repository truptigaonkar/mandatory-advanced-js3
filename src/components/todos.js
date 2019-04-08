import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import jwt from 'jsonwebtoken'
import { token$, updateToken } from '../store'
import axios from 'axios'

let API_ROOT = "http://ec2-13-53-32-89.eu-north-1.compute.amazonaws.com:3000";

export default class Todos extends Component {

  constructor(props) {
    super(props);
    this.state = {
      token: token$.value,
      email: '',
      message: '',
      newtodo: '',
      todolist: []
    }
  }

  // Fetch the data from An External API  
  componentDidMount() {
    this.subscription = token$.subscribe((token) => {
      this.setState({ token });
    });

    this.source = axios.CancelToken.source(); // Cancel active request

    // Getting profile (email) information
    if (!!this.state.token) {
      const decoded = jwt.decode(token$.value);
      console.log("Decoded email: ", decoded.email);
      this.setState({ email: decoded.email })
    } else {
      this.props.history.push("/");
    }

    // READ/LIST: Fetching todo list
    axios
      .get(API_ROOT + "/todos",
        {
          cancelToken: this.source.token,
          headers: { Authorization: "Bearer " + token$.value, }
        })
      .then(response => {
        console.log("Response is: ", response);
        this.setState({ todolist: response.data.todos })
        //console.log("Todo list contains: ", this.state.todolist[0]);
      })
      .catch(error => {
        console.log(error);
        this.setState({ message: "Something went wrong !!!!" });
      })
  }

  // Unmount mounted data
  componentWillUnmount() {
    this.source.cancel(); // Cancel active request
    this.subscription.unsubscribe(); // cancel active subscription
    updateToken(null);
  }

  // Handling logout button
  handleLogout(e) {
    e.preventDefault();
    updateToken(null);
    this.props.history.push("/");
  }

  // Handling input button
  handleChange(e) {
    e.preventDefault();
    this.setState({ newtodo: e.target.value });
  }

  // CREATE: Handling creating new todo form
  handleFormSubmit(e) {
    e.preventDefault();

    this.subscription = token$.subscribe((token) => {
      this.setState({ token });
    });

    this.source = axios.CancelToken.source();

    axios
      .post(API_ROOT + "/todos",
        { content: this.state.newtodo },
        {
          headers:{
            cancelToken: this.source.token,
            Authorization: "Bearer " + token$.value
          }
        }
      )
      .then((response) => {
        console.log(response);
        this.componentDidMount() // This helps to see todo list added after adding 
        this.setState({
          message: "Created new todo successfully",
          newtodo: "", // Clearing an input value after form submit
        });
      })
      .catch((error) => {
        this.setState({ message: "Something went wrong !!!!" });
      });
  }

  // DELETE: Handling delete todo function
  handleDeleteTodo(id) {
    axios
      .delete(API_ROOT + "/todos/" + id, {
        headers: {
          cancelToken: this.source.token,
          Authorization: "Bearer " + token$.value
        },
      })
      .then(response => {
        this.setState({ message: "Deleted todo successfully" });
        this.componentDidMount() //Refresh the page with todo list

      })
      .catch(error => {
        console.log(error);
        this.setState({ message: "Something went wrong !!!!" });
        this.componentDidMount() //Refresh the page with todo list
      })
  }

  render() {
    return (
      <>
        <Helmet>
          <title>Todos</title>
        </Helmet>

        <p>Welcome User, {this.state.email} <button type="button" onClick={this.handleLogout.bind(this)}>todos.js Logout</button></p>

        <h2>Todo Page</h2>
        <div className="message">{this.state.message}</div> {/* success/error messsage */}

        {/* Creating new todos */}
        <form onSubmit={this.handleFormSubmit.bind(this)}>
          <input type="text" value={this.state.newtodo} onChange={this.handleChange.bind(this)} />
          <button>Add Todos</button>
        </form><br />

        {/* Listing todos */}
        {
          this.state.todolist.map(todo => {
            //console.log("Single todo is: ", todo);
            return (
              <ul key={todo.id}>
                <li >{todo.content} <button onClick={() => { this.handleDeleteTodo(todo.id) }}>Delete</button></li>
              </ul>
            )
          })
        }

      </>
    )
  }
}
