import axios from 'axios'
import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const Book = ({book}) => {
    const currentUser = useSelector((state)=>state.user.currentUser)

    // axiosJWT.interceptors.request.use(
    //     async (config) => {
    //       let currentDate = new Date();
    //       const decodedToken = jwt_decode(user.accessToken);
    //       console.log(decodedToken)
    //       if (decodedToken.exp * 1000 < currentDate.getTime()) {
    //         const data = await refreshToken(user.refreshToken);
    //         setUser({
    //             ...user,
    //             accessToken: data.accessToken,
    //             refreshToken: data.refreshToken,
    //           });
    //         console.log(data)
    //         config.headers["authorization"] = "Bearer " + data.accessToken;
    //       }
    //       return config;
    //     },
    //     (error) => {
    //       return Promise.reject(error);
    //     }
    //   );

    const handleDelete = async (id) => {
        console.log(id)
        try{
            await axios.delete(`http://localhost:8800/books/${id}`, currentUser.refreshToken , {
                headers: {authorization: "Bearer " + currentUser.accessToken},
            })
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