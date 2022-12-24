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
   let obj={}
   const {cartId,productId}=data
       obj.userId=userId
      obj.items={productId:productId,quantity:1}
   //if(req.body==0){return res.status(400).send({status:false,msg:"body is empty"})}

  
  const useridexist=await userModel.findById(userId)
  if(!useridexist){return res.status(404).send({status:false,msg:"userid is not existing "})}
  const productexist=await productModel.findOne({_id:productId,isDeleted:false})

 if(!productexist){return res.status(404).send({status:false,msg:"productid is not existing"})}
 obj.totalPrice=productexist.price
 if(cartId){
  const useridunique=await cartmodel.findById(cartId)
   if(!useridunique){return res.status(400).send({status:false,msg:"cardid is not existing"})}
   {
     let totalitem=0
     let mg=0
     let newabc=useridunique.items
     console.log(newabc)
     for(let i=0;i<useridunique.totalItems;i++){
       if(newabc[i].productId==productId){
         newabc[i].quantity++
          mg++
         
       } 
      }
        if(mg==0){
        newabc.push(obj.items)
        totalitem +=useridunique.totalItems+1}
       
     const newsavedata=await cartmodel.findOneAndUpdate({_id:cartId,userId:userId},{$set:{items:newabc,totalItems:newabc.length},$inc:{totalPrice:+productexist.price}},{new:true}).populate('items.productId','title productImage price')
     return res.status(201).send({status:false,msg:"sucessfully added",data:newsavedata})
     }}
     
 
 
    



  const savedata=await cartmodel.create(obj)

  return res.status(201).send({status:false,msg:"successfull",data:savedata})
 

}catch(err){return res.status(500).send({status:false,msg:err.message})}

}

exports.updatecart=async function(req,res){
  const userid=req.params.userId
  const data=req.body
   const {productId,removeproduct,cartId}=data
  if(!objectId.isValid(userid)){return res.status(400).send({status:false,msg:"Please enter valid userid"})}
  if(!objectId.isValid(productId)){return res.status(400).send({status:false,msg:"Please enter valid userid"})}
  if(!removeproduct){return res.status(400).send({status:false,msg:"please enter this filed"})}

  const useridexist=await userModel.findById(userid)
  if(!useridexist){return res.status(400).send({status:false,msg:"userid is not existing"})}
  const productidexist=await productModel.findById(productId)
  if(!productidexist){return res.status(400).send({status:false,msg:"userid is not existing"})}
  const {price}=productidexist
  const cardidexist=await cartmodel.findById({_id:cartId,isDeleted:false})
  if(!cardidexist){return res.status(400).send({status:false,msg:"cartid is not existing"})}
  const {items,totalItems,totalPrice}=cardidexist
    const totalitems=totalItems
  
    for(let i=0; i<totalitems; i++)
      {
        
        const {quantity,productId}=items[i]
        let totalprice=totalPrice-price*quantity
        let id=productId
        if(productId==id)
        {
          if(removeproduct==0){
            let totalItems=totalitems-1
          const updatedata=await cartmodel.findByIdAndUpdate(cartId,{$set:{items:items.splice(items[i],1),totalItems:totalItems,totalPrice:totalprice}},{new:true})
          return res.status(200).send({status:false,msg:"update sucessfull",data:updatedata})
        }/*else{
          
          
          const updatedata=await cartmodel.findByIdAndUpdate(cartId,{$inc:{items[i].quantity:quantity-1}},{new:true})
          return res.status(200).send({status:false,msg:"update sucessfull",data:updatedata})
        }*/
      }
    }
  
 }
