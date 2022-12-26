const ordermodel=require('../models/orderModel')
const  userModel = require('../models/userModel')
const cartModel = require('../models/cartModel')
const mongoose=require('mongoose')
const objectId=mongoose.Types.ObjectId
exports.createorder=async function(req,res){
   try{ const userid=req.params.userId
    const data=req.body
    const {cartId}=data

    if(!req.body){return res.status(400).send({status:false,msg:"Please enter cartid in body"})}
    if(!objectId.isValid){return res.status(400).send({status:false,msg:"Please enter valide"})}
    if(!objectId.isValid){return res.status(400).send({status:false,msg:"Please enetre valide"})}

    const useridexist=await userModel.findOne({_id:userid})
     console.log(useridexist)
    if(!useridexist){return res.status(404).send({status:false,msg:"userid is not exist"})}

    const caridexist=await cartModel.findByIdAndUpdate(cartId,{$set:{items:[],totalItems:0,totalPrice:0}})
    console.log(caridexist)
    if(caridexist.items.length==0){return res.status(404).send({status:false,msg:"cartid is not found"})}
     
    const {userId,items,totalPrice,totalItems}=caridexist
      let count=0
       for(let i=0; i<totalItems; i++)
       {
         count=count+items[i].quantity
       }
   
        data.userId=userId,
        data.items=items,
        data.totalPrice=totalPrice,
        data.totalItems=totalItems,
        data.totalQuantity=count
        


   const savedata=await ordermodel.create(data)
   return res.status(200).send({status:true,msg:"create successful",order:savedata})
    }catch(err){return res.status(500).send({status:false,msg:err.message})}

}


exports.updateorder=async function(req,res){
    let userId=req.params.userId
    let userdata=await userModel.findOne({_id:userId})
    if(!userdata) return res.status(404).send({status:false,msg:"user is not exist"})
    let data=req.body
    let {orderId}=data
    let savedata=await ordermodel.findOneAndUpdate({_id:orderId,cancellable:true,userId:userId,status:"pending"},{$set:{status:"cancled"}},{new:true})
    console.log(savedata)
    if(!savedata){return res.status(404).send({status:false,msg:"order is fail"})}
    return res.status(200).send({status:true,msg:"sucessfully update",data:savedata})
}