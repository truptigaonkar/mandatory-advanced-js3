import React, {useState} from 'react'
import { token$ } from '../store'
import axios from 'axios'

const Todolist = (props:any) => {
    const {todos, setTodos} = props
    const [message, setMessage] = useState('')
    const [error, setError] = useState(false)
    const [token] = useState(token$.value)

    const handleDelete = (id:any) =>{
        axios.delete(`http://localhost:8000/todos/${id}`, { headers: { Authorization: "Bearer " + token }})
        .then((res) => {
            console.log(res.data);
            const latestState = [...todos]
            const itemCheck = (item:any) => id !== item.id
            setTodos(latestState.filter(itemCheck))
            setMessage('Deleted todo successfully')
        })
        .catch((err) => {
            //setError(err.message);
            setError(err.response.data.message)
        });
    }

    return (
        <div>
            <h4>Todo List</h4>
            <div style={{color:'red'}}>{error && <div>Register: Please fill in all the fields - <b>{error}</b></div>}</div>
            <p style={{color:'green'}}>{message}</p>
            {todos.map((todo:any) =>(
                <ul key={todo.id}>
                <li>{todo.id} - {todo.content} - <button onClick={() => handleDelete(todo.id)}>Delete</button></li>
                </ul>
            ))}
        </div>
    )
}

export default Todolist;
