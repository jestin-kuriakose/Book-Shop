import axios from 'axios'
import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import jwt_decode from "jwt-decode";

const Login = () => {
    const emailRef = useRef()
    const passwordRef = useRef()
    const [user, setUser] = useState({})
    const [error, setError] = useState("")

    const handleLogin = async() => {
        setError("")
        setUser({})
        try{
            const res = await axios.post('http://localhost:8800/login',
            {
                email: emailRef.current.value,
                password: passwordRef.current.value
            })
            localStorage.setItem("user_email", res.data.user_email)
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
    <div className='form'>
        <h1>Login</h1>
        {user?.user_email && <p>Welcome {user.user_email} {user.isAdmin ? "(Admin)" : "(User)"}</p>}
        <input ref={emailRef} type="text" placeholder='Email' />
        <input ref={passwordRef} type="password" name="password" id="password" placeholder='password' />
        {error && <p style={{color:"indianred"}}>{error}</p>}
        <button type='submit' onClick={()=>handleLogin()}>Login</button>
        <Link to={'/register'}>New user ? Register here !</Link>
    </div>
  )
}

export default Login