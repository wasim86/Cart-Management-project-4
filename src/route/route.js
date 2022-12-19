const express=require('express')
const router=express.Router()
let{create}=require("../controler/user")



router.post("/register",create)




module.exports=router


