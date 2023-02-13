import axios from 'axios'
import React, { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import jwt_decode from "jwt-decode";
import { useDispatch, useSelector } from 'react-redux';
import { onSuccess } from '../redux/userSlice';

const Login = () => {
    const dispatch = useDispatch()
    const [loginInput, setLoginInput] = useState({})
    const [error, setError] = useState("")
    const navigate = useNavigate()
    const currentUser = useSelector((state)=>state.user.currentUser)

    const handleLogin = async(e) => {
        e.preventDefault()
        setError("")
        try{
            const res = await axios.post('http://localhost:8800/login',
            {
                email: loginInput.email,
                password: loginInput.password
            })
            dispatch(onSuccess(res.data))
            setUser(res.data)
            navigate('/books')

        } catch(err) {
            console.log(err.response.data)
            setError(err.response.data)
        }

    }
  return (
    <form className='form' onSubmit={handleLogin}>
        <h1>Login</h1>
        <h2>{currentUser.user_name}</h2>
        {currentUser?.user_email && <p>Welcome {currentUser.user_email} {currentUser.isAdmin ? "(Admin)" : "(User)"}</p>}
        <input onChange={(e)=>setLoginInput((prev)=>({...prev, [e.target.name]: e.target.value}))} type="email" placeholder='Email' name='email' required/>
        <input onChange={(e)=>setLoginInput((prev)=>({...prev, [e.target.name]: e.target.value}))} type="password" name="password" id="password" placeholder='password' required />
        {error && <p style={{color:"indianred"}}>{error}</p>}
        <button disabled={!loginInput.email || !loginInput.password} type='submit'>Login</button>
        <Link to={'/register'}>New user ? Register here !</Link>
    </form>
  )
}

export default Login