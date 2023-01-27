import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const Update = () => {
  const [bookInfo, setBookInfo] = useState({
      title: "",
      desc: "",
      price: null,
      cover: ""
  })
  const location = useLocation()
  const bookId = location.pathname.split("/")[2]
  const navigate = useNavigate()

  // useEffect(()=> {
  //   const fetchBook = async () => {
  //     try{
  //       const res = await axios.get(`http://localhost:8800/books/${bookId}`)
  //       setBookInfo({
  //         title: res.data[0].title,
  //         desc: res.data[0].desc,
  //         price: res.data[0].price,
  //         cover: res.data[0].cover
  //       })
  //     } catch(err) {
  //       console.log(err)
  //     }
  //   }
  //   fetchBook()
  // }, [])
  const handleSave = async () => {
    try{
      const res = await axios.put(`http://localhost:8800/books/${bookId}`, bookInfo)
      console.log(res.data)
    } catch(err) {
      console.log(err)
    }
  }

  const handleChange = (e) => {
    setBookInfo((prev)=> ({...prev, [e.target.name]: e.target.value}))
  }

  return (
    <div className='form'>
      <h1>Edit Book</h1>

      <input type="text" id='title' name='title' placeholder='Title' onChange={handleChange}/>

      <textarea type="text" id='desc' name='desc' placeholder='Description' onChange={handleChange} />

      <input type="text" id='price' name='price' placeholder='Price' onChange={handleChange}/>

      <button onClick={()=>navigate('/')}>Back</button>
      <button className='' onClick={()=>handleSave()}>Save</button>

    </div>
  )
}

export default Update