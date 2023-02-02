import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const Update = () => {
  const [bookInfo, setBookInfo] = useState({
      title: "",
      desc: "",
      price: undefined,
      imageUrl: ""
  })

  const [uploadedFile, setUploadedFile] = useState(null)
  const [fileUrl, setFileUrl] = useState()
  const location = useLocation()
  const bookId = location.pathname.split("/")[2]
  const navigate = useNavigate()

  useEffect(()=> {
    const fetchBook = async () => {
      try{
        const res = await axios.get(`http://localhost:8800/books/${bookId}`)
        setBookInfo({
          title: res.data[0].title,
          desc: res.data[0].desc,
          price: res.data[0].price,
          imageUrl: res.data[0].imageUrl
        })

      } catch(err) {
        console.log(err)
      }
    }
    fetchBook()
  }, [])

  useEffect(()=> {
    if(!uploadedFile) {
      setFileUrl(undefined)
      return;
    }
    const objectURL = URL.createObjectURL(uploadedFile)
    setFileUrl(objectURL)
    return(()=> URL.revokeObjectURL(objectURL))
  }, [uploadedFile])

  const handleSave = async () => {
    const formData = new FormData
    formData.append("file", uploadedFile)
    formData.append("title", bookInfo.title)
    console.log(formData)
    // try{
    //   const res = await axios.put(`http://localhost:8800/books/${bookId}`, bookInfo)
    //   console.log(res.data)
    // } catch(err) {
    //   console.log(err)
    // }
  }

  const handleUpload = (e) => {
    const file = e.target.files[0]
    setUploadedFile(file)
  }

  const handleChange = (e) => {
    setBookInfo((prev)=> ({...prev, [e.target.name]: e.target.value}))
  }

  return (
    <div className='form'>
      <h1>Edit Book</h1>
      <input type="text" id='title' name='title' placeholder="Title" defaultValue={bookInfo.title} onChange={handleChange}/>

      <textarea type="text" id='desc' name='desc' placeholder='Description' defaultValue={bookInfo.desc} onChange={handleChange} />

      <input type="number" id='price' name='price' placeholder='Price' defaultValue={bookInfo.price} onChange={handleChange}/>

      <img width={200} height={300} src={uploadedFile ? fileUrl : bookInfo.imageUrl} alt="" />

      <input type="file" name="imageUrl" id="cover" onChange={handleUpload}/>

      <button onClick={()=>navigate('/')}>Back</button>
      <button className='' onClick={()=>handleSave()}>Save</button>

    </div>
  )
}

export default Update