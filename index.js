import express from 'express'
import * as IPFS from 'ipfs-core'
import multer from 'multer'

const ipfs = await IPFS.create()
const app = express()

app.use(express.json())

app.get('/',(req,res)=>{
    return res.send('Welcome to this IPFS app')
})

app.listen(3000, ()=>{
    console.log('Server started at port 3000') 
})

app.post('/upload', async(req,res)=>{
    const { headers, files } = req;
    const { buffer, originalname: filename } = files[0];
    const fileHash = await addFile(buffer)
    return res.send(fileHash)
})

const addFile = async({content})=>{
    const data = await ipfs.add(content)
    return data
}


