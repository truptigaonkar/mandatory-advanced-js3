import React from 'react'
import {BrowserRouter as Router, Route, Link} from 'react-router-dom'
import Register from './components/Register'
import './App.css'

function App() {
  return (
    <div className="App">
      <Router>
        <Link to="/">Register</Link>
        <Route exact path="/" component={Register}/>
      </Router>
    </div>
  );
}

export default App;
