import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import jwt from 'jsonwebtoken'
import { token$, updateToken } from '../store'
import axios from 'axios'

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import TextField from "@material-ui/core/TextField";
import Chip from '@material-ui/core/Chip';

let API_ROOT = "http://localhost:8000";

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
        this.setState({ todolist: response.data.todos.reverse() })
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
          headers: {
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
        this.setState({ message: "Please fill in the field !!!!" });
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
      <div>
        <Helmet>
          <title>Todos</title>
        </Helmet>
        <AppBar>
          <Toolbar>
            <IconButton color="inherit" aria-label="Menu" >
              <i className="material-icons accountman">account_circle </i> {this.state.email}
            </IconButton>
            <Typography variant="h6" color="inherit" style={{ width: '100%', textAlign: 'right' }}  >
              <Button color="inherit" onClick={this.handleLogout.bind(this)} >Logout</Button>
            </Typography>
          </Toolbar>
        </AppBar> <br /><br /><br /><br /><br />

        <div className="form">
          <div marginBottom='5px'>
          {/* Creating new todos */}
          <form onSubmit={this.handleFormSubmit.bind(this)}>
            <TextField style={{ width: '100%' }}
              id="outlined-Add-Todo-input"
              label="Add Todos"
              type="text"
              variant="outlined"
              value={this.state.newtodo}
              onChange={this.handleChange.bind(this)}
            />
          </form>
          <div className="message">{this.state.message}</div> {/* success/error messsage */}
          </div>
          {/* Listing todos */}
          <div className="todo__form">
            {
              this.state.todolist.map(todo => {
                //console.log("Single todo is: ", todo);
                return (
                  <>
                    <ul key={todo.id} >
                      <Chip style={{ textAlign: 'right', justifyContent: "space-between", marginBottom: '0' }}
                        label={todo.content}
                        onDelete={() => { this.handleDeleteTodo(todo.id) }}
                        color="secondary"
                      />
                    </ul>
                  </>
                )
              })
            }
          </div>
        </div>
      </div>
    )
  }
}
