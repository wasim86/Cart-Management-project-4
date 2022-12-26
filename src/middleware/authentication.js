const jwt = require('jsonwebtoken')
const userModel = require('../models/userModel')


exports.authentication = function(req,res, next){
    try{
let token = req.headers.authorization
 console.log(token)
  token=token.split(" ")
if (!token) return res.status(400).send({ status: false, message: "Token is mandatory" })
jwt.verify(token[1], "project5",(error, decoded)=>{
 if(error)return res.status(401).send({status: false, message: error.message})
req.id = decoded.userId
next()
})
    }
    catch(error){
        return res.status(500).send({status: false, message: error.message})
    }
}


/***************************************autherization************************************************/

exports.autherization = async function(req,res, next){
    let user = req.params.userId 
    if(!user) return res.status(404).send({status: false, msg: "id not found"})
    let data = await userModel.findById(user)
    console.log(data.user)
    if(user!==req.id) return res.status(403).send({status: false , msg: "unautherized user"})


  next()

}