const express=require('express')
const router=express.Router()
let{create,login, getuser, updateuser}=require("../controller/user")
let{authentication} = require('../middleware/authentication')




router.post("/register",create)
router.post('/login',login)
router.get("/user/:userId/profile",authentication,getuser)
router.put("/user/:userId/profile",updateuser)



module.exports=router


