import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Add = () => {
  const navigate = useNavigate()
  const [uploadedFile, setUploadedFile] = useState(null)
  const [fileName, setFileName] = useState()
  const [fileUrl, setFileUrl] = useState()
  const [bookInfo, setBookInfo] = useState({
    title: "",
    desc: "",
    price: null,
    imageUrl:""
  })

  const handleChange = (e) => {
    setBookInfo((prev)=> ({...prev, [e.target.name]: e.target.value}))
  }

  const handleUpload = (e) => {
    const file = e.target.files[0]
    const fname = e.target.files[0].name
    setUploadedFile(file)
    setFileName(fname)
  }

  const handleSave = async () => {
    const formData = new FormData()
    formData.append("file", uploadedFile)
    formData.append("title", bookInfo.title)
    formData.append("desc", bookInfo.desc)
    formData.append("price", bookInfo.price)
    formData.append("fileName", fileName)

    try{
      const result = await axios.post(`http://localhost:8800/books`, formData, {headers: {'Content-Type': 'multipart/form-data'}})
      console.log(result.data)
      navigate("/")
    } catch(err) {
      console.log(err)
    }
  }

  useEffect(()=> {
    if(!uploadedFile) {
      setFileUrl(undefined)
      return
    }
    const objectURL = URL.createObjectURL(uploadedFile)
    setFileUrl(objectURL)
    return() => URL.revokeObjectURL(objectURL)
  },[uploadedFile])

  return (
    <div className='form'>
      <h1>Add New Book</h1>
      <input type="text" placeholder='Book Title' name='title' onChange={handleChange}/>
      <textarea name="desc" id="" cols="30" rows="10" placeholder='Description' onChange={handleChange}></textarea>
      <input type="number" name='price' placeholder='Price' onChange={handleChange}/>
      <img width="100" height="150" src={fileUrl} alt="" />
      <input type="file" name='cover' onChange={handleUpload}/>
      <button onClick={()=>handleSave()}>Save</button>
    </div>
  )
}

export default Add