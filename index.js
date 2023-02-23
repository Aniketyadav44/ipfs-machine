import express from 'express'
import * as IPFS from 'ipfs-core'
import multer from 'multer'
import bodyParser from 'body-parser'
import crypto from 'crypto'
import fs from 'fs'

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
    const { buffer, originalname: filename } = req.file;
    const secretKey = req.body.secretKey

    var fileHash = "failed"
    const uplaodData = {"content":buffer}
    fileHash = await addFile(uplaodData)
    
    var encryptedCID = encrypt(secretKey, fileHash["path"])
    return res.send({"encryptedCID":encryptedCID,"size": fileHash["size"],"mode": fileHash["mode"],})
})

//uploading file to ipfs
const addFile = async({content})=>{
    const data = await ipfs.add(content)
    return data
}

//encryption and decryption service
var algorithm = "aes-192-cbc";
var buff = fs.readFileSync("./test")
const encrypt = (secretKey, cid)=>{
    const key = crypto.scryptSync(secretKey, 'salt', 24)
    
    const cipher = crypto.createCipheriv(algorithm, key, buff)
    var encryptedCID = cipher.update(cid, 'utf8', 'hex') + cipher.final('hex')
    return encryptedCID
}

//decrypt route
app.post('/decrypt', upload.any(), async(req,res)=>{
    try{
        const secretKey = req.body.secretKey
        const encrypted = req.body.encrypted

        const key = crypto.scryptSync(secretKey, 'salt', 24)

        const decipher = crypto.createDecipheriv(algorithm, key, buff)
        var decrypted = decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8')
        return res.send({"CID":decrypted})
    }catch(err){
        if(err.code=="ERR_OSSL_BAD_DECRYPT")
        return res.status(401).send({"error":"INVALID_KEY"})
    }
})


