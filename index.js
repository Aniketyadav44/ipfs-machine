import express from 'express'
import * as IPFS from 'ipfs-core'
import multer from 'multer'
import bodyParser from 'body-parser'

const ipfs = await IPFS.create()
const app = express()
const upload = multer()

app.use(express.json())
app.use(bodyParser.urlencoded({extended:true}))

app.get('/',(req,res)=>{
    return res.send('Welcome to this IPFS app')
})

app.listen(3000, ()=>{
    console.log('Server started at port 3000') 
})

app.post('/upload', upload.single("file"), async(req,res)=>{
    // const { headers, files } = req;
    // const { buffer, originalname: filename } = files[0];

    var fileHash = "sample"
    // req.busboy.on('file', async (fieldname, file, filename) => {
    //     console.log(file)
    //     console.log("Uploading: " + filename); 
    //     fileHash = await addFile(file)
    // });
    // const fileHash = await addFile(buffer)
    const data = req.file
    console.log(data)
    return res.send(fileHash)
})

const addFile = async({content})=>{
    const data = await ipfs.add(content)
    return data
}


