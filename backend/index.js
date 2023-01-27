import express, { json } from "express"
import mysql from "mysql"
import cors from "cors"

const app = express()


const db = mysql.createConnection({
    host:"172.28.16.1",
    port: 3307,
    user:"jestin",
    password:"Jestin12345",
    database: "test"
})

app.use(express.json())

app.use(cors())

app.get('/', (req, res) => {
    res.json("Hi!, This is the Backend !")
})

app.post('/books', (req,res)=> {
    const q = "INSERT INTO books (`title`,`desc`,`cover`,`price`) VALUES (?)";
    const values = [req.body.title, req.body.desc, req.body.cover, req.body.price]

    db.query(q, [values], (err, data) => {
        if(err) return res.json(err)
        return res.json(data)
    })
})

app.get('/books', (req,res)=> {
    const q = "SELECT * FROM books"
    db.query(q, (err, data)=>{
        if(err) {
            res.json(err)
            console.log(err)
        }
        return res.json(data)
    })
})

app.get('/books/:id', (req,res)=> {
    const bookId = req.params.id
    const q = "SELECT * FROM books where id = ? "
    db.query(q, [bookId], (err, data)=>{
        if(err) {
            res.json(err)
            console.log(err)
        }
        return res.json(data)
    })
})

app.delete('/books/:id', (req, res) => {
    const bookId = req.params.id
    const q = "DELETE FROM books WHERE id= ? "

    db.query(q, [bookId], (err, data) => {
        if(err) return res.json(err)
        return res.json(data)
    })
})

app.put('/books/:id', (req,res) => {
    const bookId = req.params.id;
    const q = "UPDATE books SET `title`= ?, `desc`= ?, `price`= ?, `cover`= ? WHERE id = ?"

    const values = [
        req.body.title,
        req.body.desc,
        req.body.price,
        req.body.cover,
      ];
    
    db.query(q, [...values, bookId], (err, data) => {
        if (err) return res.send(err);
        return res.json(data);
    })
})

app.listen(8800, ()=>{
    console.log("Server connected")
})