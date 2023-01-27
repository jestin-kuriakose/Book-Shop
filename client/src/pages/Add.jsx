import axios from 'axios'
import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Add = () => {
  const navigate = useNavigate()
  const [bookInfo, setBookInfo] = useState({
    title: "",
    desc: "",
    price: null,
    cover:""
  })

  const handleChange = (e) => {
    setBookInfo((prev)=> ({...prev, [e.target.name]: e.target.value}))
  }

  const handleSave = async () => {
    try{
      const res = await axios.post(`http://localhost:8800/books`, bookInfo)
      console.log(res.data)
      navigate("/")
    } catch(err) {
      console.log(err)
    }
  }

  return (
    <div className='form'>
      <h1>Add New Book</h1>
      <input type="text" placeholder='Book Title' name='title' onChange={handleChange}/>
      <textarea name="desc" id="" cols="30" rows="10" placeholder='Description' onChange={handleChange}></textarea>
      <input type="number" name='price' placeholder='Price' onChange={handleChange}/>
      <input type="file" name='cover'/>
      <button onClick={()=>handleSave()}>Save</button>
    </div>
  )
}

export default Add