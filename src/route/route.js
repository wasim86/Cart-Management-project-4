const express=require('express')
const router=express.Router()
let{create,login, getuser, updateuser}=require("../controller/user")
//let{authentication} = require('../middleware/authentication')
let { createproduct, getproduct, getProductbyid, updateProduct, deleteProductById }=require('../controller/product')

let{authentication,autherization} = require('../middleware/authentication')
let { createcart, updatecart, getCartData, deletecart }=require('../controller/cart')
let { createorder, updateorder }=require('../controller/order')



router.post("/register",create)
router.post('/login',login)
router.get("/user/:userId/profile",getuser)
router.put("/user/:userId/profile",updateuser)

router.post("/products",createproduct)
router.get('/products',getproduct)
router.get("/products/:productId",getProductbyid)
router.put("/products/:productId",updateProduct)
router.delete("/products/:productId",deleteProductById)

router.post("/user/:userId/cart",createcart)
router.put("/users/:userId/cart",updatecart)
router.get("/users/:userId/cart",getCartData)
router.delete("/users/:userId/cart",deletecart)

router.post("/users/:userId/orders",createorder)
router.put("/users/:userId/orders",updateorder)


module.exports=router


