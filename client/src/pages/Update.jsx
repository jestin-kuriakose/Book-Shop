import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const Update = () => {
  const [bookInfo, setBookInfo] = useState({
      title: "",
      desc: "",
      price: null,
      imageUrl: "",
      imageName: ""
  })

  const titleRef = useRef()
  const priceRef = useRef()
  const [uploadedFile, setUploadedFile] = useState(null)
  const [fileUrl, setFileUrl] = useState()
  const [formIncomplete, setFormIncomplete] = useState({title: false, price: false})
  const [isFetching, setIsFetching] = useState(false)
  const [errorFound, setErrorFound] = useState(false)
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
          imageUrl: res.data[0].imageUrl,
          imageName: res.data[0].imageName
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
    if(titleRef.current.value == '') {
      setFormIncomplete({title: true})
      if(priceRef.current.value == '') {
        setFormIncomplete((prev)=>({...prev, price: true}))
      } else {
        setFormIncomplete((prev)=>({...prev, price: false}))
      }
      return
    } else {
      setFormIncomplete({title: false})
      if(priceRef.current.value == '') {
        setFormIncomplete((prev)=>({...prev, price: true}))
        return
      } else {
        setFormIncomplete((prev)=>({...prev, price: false}))
      }
      console.log(formIncomplete)
    }

    setIsFetching(true)
    setErrorFound(false)

    const formData = new FormData

    if(uploadedFile) {
      formData.append("file", uploadedFile)
    }

    formData.append("title", bookInfo.title)
    formData.append("desc", bookInfo.desc)
    formData.append("price", bookInfo.price)

    try{
      const res = await axios.put(`http://localhost:8800/books/${bookId}`, formData, { "headers": {"Content-Type": "multipart/form-data"}})
      console.log(res.data)
      setIsFetching(false)
      navigate('/')
    } catch(err) {
      console.log(err)
      setIsFetching(false)
      setErrorFound(true)
    }
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
      <input ref={titleRef} className={formIncomplete.title ? 'incomplete' : 'complete'} type="text" id='title' name='title' placeholder="Title" defaultValue={bookInfo.title} onChange={handleChange}/>
      <textarea type="text" id='desc' name='desc' placeholder='Description' defaultValue={bookInfo.desc} onChange={handleChange} />
      <input ref={priceRef} className={formIncomplete.price ? 'incomplete' : 'complete'} type="number" id='price' name='price' placeholder='Price' defaultValue={bookInfo.price} onChange={handleChange}/>
      <img width={200} height={300} src={uploadedFile ? fileUrl : bookInfo.imageUrl} alt="" />
      <input type="file" name="imageUrl" id="cover" onChange={handleUpload}/>

      {errorFound && <p style={{color:"indianred", margin:"0"}}>Error saving new book. Please try again</p>}
      {(formIncomplete.title || formIncomplete.price) && <p style={{color:"indianred"}}>Please complete the required columns to continue</p>}
      
      <button onClick={()=>navigate('/')}>Back</button>
      <button className='' onClick={()=>handleSave()}>{isFetching ? 'Saving' : 'Save'}</button>

    </div>
  )
}

export default Update