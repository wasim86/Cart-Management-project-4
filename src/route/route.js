const express=require('express')
const router=express.Router()
let{create,login, getuser, updateuser}=require("../controller/user")
<<<<<<< HEAD
let{authentication} = require('../middleware/authentication')
let { createproduct, getproduct }=require('../controller/product')
=======
let{authentication,autherization} = require('../middleware/authentication')
>>>>>>> 01b3801 (authentication)




router.post("/register",create)
router.post('/login',login)
router.get("/user/:userId/profile",getuser)
router.put("/user/:userId/profile",authentication,autherization,updateuser)

router.post("/products",createproduct)
router.get('/products',getproduct)



module.exports=router


