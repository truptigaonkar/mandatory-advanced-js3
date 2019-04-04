import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';
import home from './components/home';
import register from './components/register';
import login from './components/login';
import todos from './components/todos';
import { token$, updateToken } from './store';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      token: null
    }
  }

  componentDidMount() {
    this.subscription = token$.subscribe((token) => {
      this.setState({ token });
    })
  }

  componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  // Handling logout button
  handleLogout(e) {
    e.preventDefault();
    updateToken(null);
  }

  render() {
    return (
      <Router>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/login">Login</Link></li>
            {/* Links and button to show after successfully login into application */}
            {this.state.token ? (
              <>
                <li><Link to="/todos">Todos</Link></li>
                <button type="button" onClick={this.handleLogout.bind(this)}><Link to="/login">App.js Logout</Link> </button>
              </>
            ) : null}
          </ul>
        </nav>
        <Route exact path="/" component={home} />
        <Route path="/register" component={register} />
        <Route path="/login" component={login} />
        <Route path="/todos" component={todos} />
      </Router>
    );
  }
}

export default App;
