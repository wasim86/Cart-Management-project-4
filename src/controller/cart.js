const cartmodel=require('../models/cartModel')
const mongoose=require('mongoose')
const userModel = require("../models/userModel")
const productModel = require("../models/productModel")
const objectId=mongoose.Types.ObjectId


    // function validetion(value){
    //     return (typeof value === "number" &&  value.trim().length > 0 && value.match( /^ [0-9]*$/))
    //   }

 exports.createcart=async function(req,res){
   try{
    const data=req.body
    const userId=req.params.userId
    const {items,cartId}=data
          //const {productId,quantity}=items
      const obj=j
    if(req.body==0){return res.status(400).send({status:false,msg:"body is empty"})}
    if(!cartId){
    if(!totalPrice){return res.status(400).send({status:false,msg:"Please enter totalprice in body"})}
    if(!userId){return res.status(400).send({status:false,msg:"Please enter userid in body"})}
    
    if(!objectId.isValid(userId)){return res.status(400).send({status:false,msg:"Please enter valid userid"})}
    if(!objectId.isValid(productId)){return res.status(400).send({status:false,msg:"Please enter valid productid"})}
    // if(!validetion(totalItems)){return res.status(400).send({status:false,msg:"Please enter only number"})}
    // if(!validetion(totalPrice)){return res.status(400).send({status:false,msg:"Please enter only number"})}
    // if(!validetion(quantity)){return res.status(400).send({status:false,msg:"Please enter only number"})}

   const useridexist=await userModel.findById(userId)
   if(!useridexist){return res.status(404).send({status:false,msg:"userid is not existing "})}
   const productexist=await productModel.findOne({_id:productId,isDeleted:false}).select({_id:1,title:1,productImage:1})
   if(!productexist){return res.status(404).send({status:false,msg:"productid is not existing"})}
    console.log(productexist)
  
    const useridunique=await cartmodel.findOne({userId:userId})
    if(useridunique){return res.status(400).send({status:false,msg:"this user id already exist"})}

   const obj={
    userId:userId,
    items:[{
        productId:productexist._id,
        title:productexist.title,
        productImage:productexist.productImage,
        quantity:quantity
         }],
 totalPrice:totalPrice,
 totalItems:totalItems
   }

 

   const savedata=await cartmodel.create(obj)
   savedata.items.title=productexist.title
   savedata.items.productImage=productexist.productImage
   return res.status(201).send({status:false,msg:"successfull",data:savedata})
  }
  if(!objectId.isValid(cartId)){return res.status(400).send({status:false,msg:"Please enter valid cartid"})}
   

}catch(err){return res.status(500).send({status:false,msg:err.message})}

}

