import express from 'express'
import * as IPFS from 'ipfs-core'

// const ipfs = create(new URL('http://ec2-54-146-87-172.compute-1.amazonaws.com:5001/'))
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
    const data = req.body
    console.log(data)
    const fileHash = await addFile(data)
    return res.send(fileHash)
})

const addFile = async({path, content})=>{
    const file = {path: path, content: Buffer.from(content)}
    console.log(content)
    const { cid } = await ipfs.add(content)
    return cid
}


