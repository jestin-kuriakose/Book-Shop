import React from 'react'
import { Link } from 'react-router-dom'

const Login = () => {
  return (
    <div className='form'>
        <h1>Login</h1>
        <input type="text" placeholder='Email' />
        <input type="password" name="password" id="password" placeholder='password' />
        <button>Login</button>
        <Link to={'/register'}>New user ? Register here !</Link>
    </div>
  )
}

export default Login