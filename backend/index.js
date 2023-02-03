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
    host:"172.16.2.28",
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

// Add a book to DB
app.post('/books', upload.single('file'), async (req,res)=> {

    //Uploading image to S3
    let url = '';
    let randomName = randomImageName()

    if(req.file) {
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
        url = await getSignedUrl(s3, getUrlCommand, { expiresIn: 3600 });
    }
    

    //Inserting book info to MySQL database
    const q = "INSERT INTO books (`title`,`desc`,`imageUrl`,`imageName`,`price`) VALUES (?)";
   const values = [req.body.title, req.body.desc, url, randomName, req.body.price]

    db.query(q, [values], (err, data) => {
        if(err) return res.json(err)
        return res.json(data)
    })
})

// Fetch all books from DB
app.get('/books', async (req,res)=> {
    let books=[];
    const q = "SELECT * FROM books"
    db.query(q, async(err, data)=>{
        if(err) {
            res.json(err)
            console.log(err)
        }
        
        //Converting the array response from MySql to JSON format
        data?.map((v, index)=> {
            const book = Object.assign({},v)
            books.push(book)
        })

        //Fetching new signed URL from S3 and inserting to converted JSON before sending to frontend
        for(const book of books) {
            if(book.imageUrl) {
                const getObjectParams = {
                    Bucket: bucketName,
                    Key: book.imageName
                }
                const getUrlCommand = new GetObjectCommand(getObjectParams);
                const url =  await getSignedUrl(s3, getUrlCommand, { expiresIn: 3600 });
                book.imageUrl = url
            }
            else {
                book.imageUrl = 'https://s3.us-west-2.amazonaws.com/secure.notion-static.com/668b5c08-0ece-447d-8469-73d4d7b5202a/book-cover.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20230201%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20230201T075253Z&X-Amz-Expires=86400&X-Amz-Signature=e039f9994b26b0f16cf22cfc491d6a7d8eb1a42bf1ad9238f391bc84f120ae3f&X-Amz-SignedHeaders=host&response-content-disposition=filename%3D%22book-cover.png%22&x-id=GetObject'
            }
            
        }

        res.json(books)
    
    })


})

// fetching individual book according to id
app.get('/books/:id', (req,res)=> {
    const bookId = req.params.id
    let books = []
    const q = "SELECT * FROM books where id = ? "
    db.query(q, [bookId], async(err, data)=>{
        if(err) {
            res.json(err)
        }
        //Converting the array response from MySql to JSON format
        data?.map((v, index)=> {
            const book = Object.assign({},v)
            books.push(book)
        })

        //Fetching new signed URL from S3 and inserting to converted JSON before sending to frontend
        for(const book of books) {
            if(book.imageUrl != '') {
                const getObjectParams = {
                    Bucket: bucketName,
                    Key: book.imageName
                }
                const getUrlCommand = new GetObjectCommand(getObjectParams);
                const url =  await getSignedUrl(s3, getUrlCommand, { expiresIn: 3600 });
                book.imageUrl = url
            }
        }
        return res.json(books)
    })
})

// Delete a book from DB
app.delete('/books/:id', (req, res) => {
    const bookId = req.params.id
    const q = "DELETE FROM books WHERE id= ? "

    db.query(q, [bookId], (err, data) => {
        if(err) return res.json(err)
        return res.json(data)
    })
})

// Edit a book in DB
app.put('/books/:id', upload.single('file'), async(req,res) => {

    let url, q, values;
    const bookId = req.params.id;

    //Uploading image to S3
    if(req.file) {
        let randomName = randomImageName()
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
        url = await getSignedUrl(s3, getUrlCommand, { expiresIn: 3600 });

        q = "UPDATE books SET `title`= ?, `desc`= ?, `price`= ?, `imageUrl`= ?, `imageName`= ? WHERE id = ?"

        values = [
            req.body.title,
            req.body.desc,
            req.body.price,
            url,
            randomName
          ];

    } else {

        q = "UPDATE books SET `title`= ?, `desc`= ?, `price`= ? WHERE id = ?"

        values = [
            req.body.title,
            req.body.desc,
            req.body.price,
          ];

    }


    db.query(q, [...values, bookId], (err, data) => {
        if (err) {
            console.log(err)
            res.send(err)
        };
        return res.json(data);
    })
})

app.listen(8800, ()=>{
    console.log("Server connected")
})