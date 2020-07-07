import React, {useState, useEffect} from 'react'
import { Redirect } from 'react-router-dom';
import axios from 'axios'
import { token$, updateToken } from '../store'
import Todolist from './Todolist';

const Todos = () => {
    const [todos, setTodos] = useState([])
    const [error, setError] = useState(false)
    const [token] = useState(token$.value)
    const [toLogin, setToLogin] = useState(false)

    useEffect(() => {
        axios.get('http://localhost:8000/todos', { headers: { Authorization: "Bearer " + token }
    })
        .then((res) => {
            console.log(res.data); 
            setTodos(res.data.todos)        
        })
        .catch((err) => {
            //setError(err.message);
            setError(err.response.data.message)
        });
    }, [token]);

    function handleLogout(e) {
        e.preventDefault();
        updateToken(null);
        setToLogin(true)
      }

    return (
        <div>
            {toLogin ? <Redirect to="/login" /> : null}
            <button onClick={handleLogout} >Logout</button>
            <div style={{color:'red'}}>{error && <div>Todos: <b>{error}</b></div>}</div>
            <Todolist todos={todos}/>
        </div>
    )
}

export default Todos;
 