const express=require('express')
const router=express.Router()
let{create, getuser, updateuser}=require("../controler/user")




router.post("/register",create)
router.get("/user/:userId/profile",getuser)
router.put("/user/:userId/profile",updateuser)



module.exports=router


