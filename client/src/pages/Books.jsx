import React, { useEffect } from 'react'
import axios from "axios"
import { useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import cover from '../assets/book-cover.png'
import jwt_decode from "jwt-decode"

const Books = () => {
    const [allBooks, setAllBooks] = useState([])

    const accessToken = localStorage.getItem("accessToken")
    const refreshToken = localStorage.getItem("refreshToken")

    const navigate = useNavigate()
    //const {a,b,c,d} = localStorage.getItem("user")
    const a = JSON.stringify(localStorage.getItem("user"))
    console.log(localStorage.getItem("user"))
    console.log(a)
    useEffect(()=> {
        const getBooks = async () => {
            try{
                const res = await axios.get("http://localhost:8800/books")
                setAllBooks(res.data)
            } catch(err) {
                console.log(err)
            }
        }
        getBooks()
    },[])

    const handleDelete = async (id) => {
        console.log(id)
        try{
            await axios.delete(`http://localhost:8800/books/${id}`)
            window.location.reload()
        }catch(err) {
            console.log(err)
        }
    }

    const handleLogout = async() => {
        await axios.post(`http://localhost:8800/logout`, refreshToken , {
            headers: {authorization: "Bearer " + accessToken},
        })
        localStorage.clear();
        window.location.reload()
    }

  return (
    <div className='books'>
        <div className='cont'>
            <h1 style={{textAlign:"center"}}>Book Shop</h1>
            <Link to={'/add'}>Add New Book</Link>
            {accessToken ? <button onClick={()=>handleLogout()}>Logout</button> : 
                            <Link to={'/login'}>Login</Link>}
                            <p></p>
        </div>

        <div className='books-container'>
            {allBooks?.map((book)=>(
            <div key={book.id} className="book-container">
                <img width={200} height={300} src={book.imageUrl? book.imageUrl : cover} alt="" />
                <p>$ {book.price}</p>
                <h3>{book.title}</h3>
                <div className='button-container'>
                    <Link to={`/update/${book.id}`}>Edit</Link>
                    <button onClick={()=>handleDelete(book.id)}>Delete</button>
                </div>
            </div>
        
        ))
        
        }</div>
    </div>
  )
}

export default Books