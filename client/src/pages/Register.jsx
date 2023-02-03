import React from 'react'
import { Link } from 'react-router-dom'

const Register = () => {
  return (
    <div className='form'>
        <h1>Register</h1>
        <input type="text" placeholder='Your Name' />
        <input type="email" name="email" id="email" placeholder='Your Email' />
        <input type="password" name="password" placeholder='Password' id="password" />
        <button>Register</button>
        <Link to={'/login'}>Existing user ? Login here !</Link>
    </div>
  )
}

export default Register