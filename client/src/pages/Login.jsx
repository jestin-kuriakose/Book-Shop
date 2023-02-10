import axios from 'axios'
import React, { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import jwt_decode from "jwt-decode";

const Login = () => {

    const [loginInput, setLoginInput] = useState({})
    const [user, setUser] = useState({})
    const [error, setError] = useState("")
    const navigate = useNavigate()

    const handleLogin = async(e) => {
        e.preventDefault()
        setError("")
        setUser({})
        try{
            const res = await axios.post('http://localhost:8800/login',
            {
                email: loginInput.email,
                password: loginInput.password
            })
            localStorage.setItem("user_email", res.data.user_email)
            localStorage.setItem("user_name", res.data.user_name)
            localStorage.setItem("isAdmin", res.data.isAdmin)
            localStorage.setItem("refreshToken", res.data.refreshToken)
            localStorage.setItem("accessToken", res.data.accessToken)

            setUser(res.data)
            window.location.reload()

        } catch(err) {
            console.log(err.response.data)
            setError(err.response.data)
        }

    }
  return (
    <form className='form' onSubmit={handleLogin}>
        <h1>Login</h1>
        {user?.user_email && <p>Welcome {user.user_email} {user.isAdmin ? "(Admin)" : "(User)"}</p>}
        <input onChange={(e)=>setLoginInput((prev)=>({...prev, [e.target.name]: e.target.value}))} type="email" placeholder='Email' name='email' required/>
        <input onChange={(e)=>setLoginInput((prev)=>({...prev, [e.target.name]: e.target.value}))} type="password" name="password" id="password" placeholder='password' required />
        {error && <p style={{color:"indianred"}}>{error}</p>}
        <button disabled={!loginInput.email || !loginInput.password} type='submit'>Login</button>
        <Link to={'/register'}>New user ? Register here !</Link>
    </form>
  )
}

export default Login