import React, { Component } from 'react';
import './App.css';
import {BrowserRouter as Router, Link, Route} from 'react-router-dom';
import home from './components/home';
import register from './components/register';
import login from './components/login';
import todos from './components/todos';

class App extends Component {
  render() {
    return (
      <Router>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/todos">Todos</Link></li>
          </ul>
        </nav>
        <Route exact path="/" component={home} />
        <Route path="/register" component={register}/>
        <Route path="/login" component={login}/>
        <Route path="/todos" component={todos}/>
      </Router>
    );
  }
}

export default App;
