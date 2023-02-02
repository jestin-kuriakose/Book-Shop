import express from "express"
import mysql from "mysql"
import cors from "cors"
import { PutObjectCommand, GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import multer from 'multer'
import dotenv from "dotenv"
import crypto from 'crypto'

dotenv.config()
const app = express();

const randomImageName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex')

const bucketName = process.env.BUCKET_NAME
const bucketRegion = process.env.BUCKET_REGION
const accessKey = process.env.ACCESS_KEY
const secretAccessKey = process.env.SECRET_ACCESS_KEY

const storage = multer.memoryStorage()
const upload = multer({storage: storage})

const s3 = new S3Client({
    credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretAccessKey
    },
    region: bucketRegion
});



const db = mysql.createConnection({
    host:"172.25.25.63",
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

app.post('/books', upload.single('file'), async (req,res)=> {
    //Uploading image to S3
    const randomName = randomImageName()
    const params = {
        Bucket: bucketName,
        Key: randomName,
        Body: req.file.buffer,
        ContentType: req.file.mimetype
    }

    const command = new PutObjectCommand(params)

    await s3.send(command)

    //Getting a signed URL from S3 to add to the database. Inserted url to 'image' key in database
    const getObjectParams = {
        Bucket: bucketName,
        Key: randomName
    }
    const getUrlCommand = new GetObjectCommand(getObjectParams);
    const url = await getSignedUrl(s3, getUrlCommand, { expiresIn: 3600 });

    //Inserting book info to MySQL database
    const q = "INSERT INTO books (`title`,`desc`,`imageUrl`,`imageName`,`price`) VALUES (?)";
    const values = [req.body.title, req.body.desc, url, randomName, req.body.price]

    db.query(q, [values], (err, data) => {
        if(err) return res.json(err)
        return res.json(data)
    })
})


app.get('/books', async (req,res)=> {
    let books=[];
    const q = "SELECT * FROM books"
    db.query(q, async(err, data)=>{
        if(err) {
            res.json(err)
            console.log(err)
        }

            data.map((v, index)=> {
                const book = Object.assign({},v)
                books.push(book)
            })

            for(const book of books) {
                const getObjectParams = {
                    Bucket: bucketName,
                    Key: book.imageName
                }
                const getUrlCommand = new GetObjectCommand(getObjectParams);
                const url =  await getSignedUrl(s3, getUrlCommand, { expiresIn: 3600 });
                book.imageUrl = url
            }

            res.json(books)

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
    const q = "UPDATE books SET `title`= ?, `desc`= ?, `price`= ?, `imageUrl`= ? WHERE id = ?"

    const values = [
        req.body.title,
        req.body.desc,
        req.body.price,
        req.body.imageUrl,
      ];
    
    db.query(q, [...values, bookId], (err, data) => {
        if (err) return res.send(err);
        return res.json(data);
    })
})

app.listen(8800, ()=>{
    console.log("Server connected")
})