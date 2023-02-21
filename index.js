import express from 'express'
import * as IPFS from 'ipfs-core'
import multer from 'multer'
import busboy from 'connect-busboy'

const ipfs = await IPFS.create()
const app = express()

app.use(express.json())
app.use(busboy())

app.get('/',(req,res)=>{
    return res.send('Welcome to this IPFS app')
})

app.listen(3000, ()=>{
    console.log('Server started at port 3000') 
})

app.post('/upload', async(req,res)=>{
    // const { headers, files } = req;
    // const { buffer, originalname: filename } = files[0];

    var fileHash = "sample"
    req.busboy.on('file', async (fieldname, file, filename) => {
        console.log(file)
        console.log("Uploading: " + filename); 
        fileHash = await addFile(file)
    });
    // const fileHash = await addFile(buffer)
    return res.send(fileHash)
})

const addFile = async({content})=>{
    const data = await ipfs.add(content)
    return data
}


