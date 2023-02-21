import express from 'express'
import * as IPFS from 'ipfs-core'

const ipfs = await IPFS.create()
const app = express()

app.use(express.json())

const multer  = require('multer');
const upload = multer({ dest: os.tmpdir() });

app.get('/',(req,res)=>{
    return res.send('Welcome to this IPFS app')
})

app.listen(3000, ()=>{
    console.log('Server started at port 3000') 
})

app.post('/upload', upload.single('file'), async(req,res)=>{
    const data = req.file
    console.log(data)
    const fileHash = await addFile(data)
    return res.send(fileHash)
})

const addFile = async({content})=>{
    const data = await ipfs.add(Buffer.from(content))
    return data
}


