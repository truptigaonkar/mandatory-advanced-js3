import React from 'react'

const Todolist = (props) => {
    const {todos} = props
    return (
        <div>
            <h4>Todo List</h4>
            {todos.map(todo =>(
                <ul key={todo.id}>
                <li>{todo.id} - {todo.content}</li>
                </ul>
            ))}
        </div>
    )
}

export default Todolist;
