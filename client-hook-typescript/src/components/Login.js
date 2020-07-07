import React, {useState} from 'react'
import axios from 'axios'
import {Redirect} from 'react-router-dom'
import { updateToken } from "../store";

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(false)
    const [message, setMessage] = useState('')
    const [toHome, setToHome] = useState(false)

    const handleLogin = (e) =>{
        e.preventDefault()
        axios.post('http://localhost:8000/auth', { email, password })
        .then((res) => {
            console.log(res.data);
            updateToken(res.data.token); // Token
          window.localStorage.setItem("token", res.data.token)  // Saving token in localStorage
            setMessage('Logined successfully')
            setToHome(true)
            setEmail([])
            setPassword([])
        })
        .catch((err) => {
            setError(err.message);
            //setError(err.response.data.message)
        }); 
    }
      
    return (
        <>
            <h4>Login User</h4>
            {toHome ? <Redirect to="/todos" /> : null}
            <div style={{color:'red'}}>{error && <div>Register: Please fill in all the fields - <b>{error}</b></div>}</div>
            <p style={{color:'green'}}>{message}</p>
            <form onSubmit={handleLogin}>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button>LOGIN</button>
            </form>
        </>
    )
}

export default Login;
