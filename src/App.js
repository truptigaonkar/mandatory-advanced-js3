import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import register from './components/register';
import login from './components/login';
import todos from './components/todos';
import { token$ } from './store';

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


  render() {
    return (
      <Router>
        <Route exact path="/" component={login} />
        <Route path="/register" component={register} />
        <Route path="/todos" component={todos} />
      </Router>
    );
  }
}

export default App;
