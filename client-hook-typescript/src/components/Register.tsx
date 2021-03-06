import React, {useState} from 'react'
import axios from 'axios'

const Register = () => {
    const [email, setEmail] = useState('' as any)
    const [password, setPassword] = useState('' as any)
    const [error, setError] = useState(false)
    const [message, setMessage] = useState('')

    const handleRegister = (e: React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault()
        axios.post('http://localhost:8000/register', { email, password })
        .then((res) => {
            //console.log(res.data);
            setMessage('Registered successfully')
            setEmail([])
            setPassword([])
        })
        .catch((err) => {
            //setError(err.message);
            setError(err.response.data.message)
        });
    }

    return (
        <>
            <h4>User Register</h4>
            <div style={{color:'red'}}>{error && <div>Register: Please fill in all the fields - <b>{error}</b></div>}</div>
            <p style={{color:'green'}}>{message}</p>
            <form onSubmit={handleRegister}>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button>REGISTER</button>
            </form>
        </>
    )
}

export default Register;
