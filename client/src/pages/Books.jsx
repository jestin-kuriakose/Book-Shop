import React, { useEffect } from 'react'
import axios from "axios"
import { useState } from 'react'
import { Link, useNavigate } from "react-router-dom";

const Books = () => {
    const [allBooks, setAllBooks] = useState([])
    const navigate = useNavigate()
    useEffect(()=> {
        const getBooks = async () => {
            try{
                const res = await axios.get('http://localhost:8800/books')
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
  return (
    <div className='books'>
        <div className='cont'>
            <h1 style={{textAlign:"center"}}>Book Shop</h1>
            <Link to={'/add'}>Add New Book</Link>
        </div>

        <div className='books-container'>
            {allBooks?.map((book)=>(
            <div key={book.id} className="book-container">
                <img width={200} height={300} src={book.imageUrl? book.imageUrl : 'https://s3.us-west-2.amazonaws.com/secure.notion-static.com/668b5c08-0ece-447d-8469-73d4d7b5202a/book-cover.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20230201%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20230201T075253Z&X-Amz-Expires=86400&X-Amz-Signature=e039f9994b26b0f16cf22cfc491d6a7d8eb1a42bf1ad9238f391bc84f120ae3f&X-Amz-SignedHeaders=host&response-content-disposition=filename%3D%22book-cover.png%22&x-id=GetObject'} alt="" />
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