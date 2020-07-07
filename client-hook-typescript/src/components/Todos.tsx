import React, {useState, useEffect} from 'react'
import { Redirect } from 'react-router-dom';
import axios from 'axios'
import jwt from "jsonwebtoken"
import { token$, updateToken } from '../store'
import Todolist from './Todolist';

const Todos = () => {
    const [todos, setTodos] = useState([] as any)
    const [error, setError] = useState(false)
    const [token] = useState(token$.value)
    const [toLogin, setToLogin] = useState(false)
    const [content, setContent] = useState('' as any)
    const [message, setMessage] = useState('')

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

    function handleLogout(e:any) {
        e.preventDefault();
        updateToken(null);
        setToLogin(true)
      }

    const handleAdd = (e: React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault()
        axios.post('http://localhost:8000/todos', { content }, { headers: { Authorization: "Bearer " + token }})
        .then((res) => {
            //console.log(res.data);
            const latestState = [...todos, res.data.todo] //Pushing text field into todos
            setTodos(latestState)
            setMessage('Added todo successfully')
            setContent([])
        })
        .catch((err) => {
            //setError(err.message);
            setError(err.response.data.message)
        });
    }

    const getEmail = (token:any) => {
        //if we do not have access to 'secret-key' then funk / decode (token) get info
        const decoded = jwt.decode(token) as any;
        return decoded.email;
    }

    return (
        <div>
            {toLogin ? <Redirect to="/login" /> : null}
            <div style={{display:'flex', justifyContent:'space-around', border:'1px solid black'}}>
            Login by: <span style={{color:'blue'}}>{getEmail(token)}</span>
                <button onClick={handleLogout}>Logout</button>
            </div>
            <div style={{color:'red'}}>{error && <div>Todos: <b>{error}</b></div>}</div>
            <p style={{color:'green'}}>{message}</p>
            <h4>Add Todos</h4>
            <form onSubmit={handleAdd}>
                <input type="text" placeholder="Add todos" value={content} onChange={(e) => setContent(e.target.value)} />
            </form>
            <Todolist todos={todos} setTodos={setTodos}/>
        </div>
    )
}

export default Todos;
 