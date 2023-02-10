import axios from 'axios'
import React from 'react'
import { Link } from 'react-router-dom'

const Book = ({book}) => {

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
    <div key={book.id} className="book-container">
        <img width={200} height={300} src={book.imageUrl? book.imageUrl : cover} alt="" />
        <p>$ {book.price}</p>
        <h3>{book.title}</h3>
        <div className='button-container'>
            <Link to={`/update/${book.id}`}>Edit</Link>
            <button onClick={()=>handleDelete(book.id)}>Delete</button>
        </div>
    </div>
  )
}

export default Book