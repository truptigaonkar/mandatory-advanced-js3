import React from 'react'
import {BrowserRouter as Router, Route, Link} from 'react-router-dom'
import Register from './components/Register'
import Login from './components/Login'
import Todos from './components/Todos'
import './App.css'

function App() {
  return (
    <div className="App">
      <Router>
        <Link to="/">Register</Link>
        <Link to="/login">Login</Link>
        <Route exact path="/" component={Register}/>
        <Route path="/login" component={Login}/>
        <Route path="/todos" component={Todos}/>
      </Router>
    </div>
  );
}

export default App;
