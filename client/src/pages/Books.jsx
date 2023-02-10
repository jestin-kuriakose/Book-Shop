import React, { useEffect } from 'react'
import axios from "axios"
import { useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import cover from '../assets/book-cover.png'
import jwt_decode from "jwt-decode"
import Book from '../components/Book';

const Books = () => {
    const [allBooks, setAllBooks] = useState([])
    const [pageSelected, setPageSelected] = useState(1)
    const accessToken = localStorage.getItem("accessToken")
    const refreshToken = localStorage.getItem("refreshToken")
    const user_name = localStorage.getItem("user_name")
    let pages = []
    const [allPages, setAllPages] = useState([])
    const navigate = useNavigate()

    useEffect(()=> {
        const getBooks = async () => {
            try{
                const res = await axios.get("http://localhost:8800/books")
                setAllBooks(res.data)
                const pageCount = (Math.ceil(res.data.length/5)*5) / 5
                console.log(res.data)
                console.log(pageCount)
                await assignPageCount(pageCount)

                let i = 1;
                let newBooks = res.data?.map((book, index)=> {
                    if(index < (5*i)) {
                        return {...book, count: i}
                    } else {
                        i++
                        return {...book, count: i}
                    }
                })

                setAllBooks(newBooks)

            } catch(err) {
                console.log(err)
            }
        }
        getBooks()
    },[])

    const assignPageCount = async (count) => {

        for(let i=1; i<=count; i++) {
            if(pages.includes(i)) {
                return
            }
             pages.push(i)
        }
        setAllPages(pages)

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
        </div>

        <p>Hello {user_name} !</p>
        
        <div>
            {allPages.map((p, index)=> (
                <button className={pageSelected == index+1 ? "btn-selected" : ""} key={index} onClick={()=>setPageSelected(p)}>{p}</button>
            ))}
        </div>

        <div className='books-container'>
            {allBooks?.map((books, index)=>(
                 (books.count == pageSelected) && <Book key={index} book={books}/>
        ))
        
        }</div>



    </div>
  )
}

export default Books