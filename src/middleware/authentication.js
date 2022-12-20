const jwt = require('jsonwebtoken')

exports.authentication = function(req,res, next){
    try{
let token = req.headers['x-api-key']
if (!token) return res.status(400).send({ status: false, message: "Token is mandatory" })
jwt.verify(token, "project5",(error, decoded)=>{
 if(error)return res.status(401).send({status: false, message: error.message})
req.id = decoded.userId
next()
})
    }
    catch(error){
        return res.status(500).send({status: false, message: error.message})
    }
}