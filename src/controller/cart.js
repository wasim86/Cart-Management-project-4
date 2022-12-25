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
       
      obj.items={productId:productId,quantity:1}
   //if(req.body==0){return res.status(400).send({status:false,msg:"body is empty"})}

  
  const useridexist=await userModel.findById(userId)
  if(!useridexist){return res.status(404).send({status:false,msg:"userid is not existing "})}
  const productexist=await productModel.findOne({_id:productId,isDeleted:false})

 if(!productexist){return res.status(404).send({status:false,msg:"productid is not existing"})}
 obj.totalPrice=productexist.price
 if(cartId){
  const useridunique=await cartmodel.findOne({_id:cartId})
   if(!useridunique){return res.status(400).send({status:false,msg:"cardid is not existing"})}
   {
     let totalitem=0
     let mg=0
     let newabc=useridunique.items
     
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

// exports.updatecart=async function(req,res){
//   const userid=req.params.userId
//   const data=req.body
//    const {productId,removeproduct,cartId}=data
//   if(!objectId.isValid(userid)){return res.status(400).send({status:false,msg:"Please enter valid userid"})}
//   if(!objectId.isValid(productId)){return res.status(400).send({status:false,msg:"Please enter valid userid"})}
//   if(!removeproduct){return res.status(400).send({status:false,msg:"please enter this filed"})}

//   const useridexist=await userModel.findById(userid)
//   if(!useridexist){return res.status(400).send({status:false,msg:"userid is not existing"})}
//   const productidexist=await productModel.findById(productId)
//   if(!productidexist){return res.status(400).send({status:false,msg:"userid is not existing"})}
//   const {price}=productidexist
//   const cardidexist=await cartmodel.findById({_id:cartId,isDeleted:false})
//   if(!cardidexist){return res.status(400).send({status:false,msg:"cartid is not existing"})}
//   const {items,totalItems,totalPrice}=cardidexist
//     const totalitems=totalItems
//     let mitems=cardidexist.items
//     console.log(mitems)
//     let xyz=[]
// let count =0
//     for(let i=0; i<totalitems; i++)
//       {
        
//         const {quantity,productId}=items[i]
        
//         let id=productId
//         if(id==productId){count++}
//       if(count==0){return res.status(404).send({status:false})}
       
//           if(removeproduct==0){
//             if(id!==productId)
//             {xyz.push(items[i])}
//          console.log(xyz)
//             let abc=totalitems-1
//             let totalprice=totalPrice-price*quantity




//           const updatedata=await cartmodel.findByIdAndUpdate(cartId,{$set:{items:xyz,totalItems:abc,totalPrice:totalprice}},{new:true})
//           return res.status(200).send({status:false,msg:"update sucessfull",data:updatedata})
//         }else{
//           if(mitems[i].productId==productId){
//             mitems[i].quantity--}
//             // if(mitems[i].quantity!==0)
//           xyz.push(mitems[i])
          
//           let totalprice=totalPrice-price
//          let totalItems=xyz.length
          
//           const updatedata=await cartmodel.findByIdAndUpdate(cartId,{items:xyz,totalPrice:totalprice,totalItems:totalItems},{new:true})
//           return res.status(200).send({status:false,msg:"update sucessfull",data:updatedata})
        
      
//     }
  
//  }}

// // for(let i=0; i<totalitems; i++)
// // {
  
// //   // let {quantity,productId}=items[i]
// //   let totalprice=totalPrice-price*items[i].quantity
// //   let id=items[i].productId
// //   if(productId==id)
// //   {
// //     if(removeproduct==0){
// //       let totalItems=totalitems-1
// //     const updatedata=await cartmodel.findByIdAndUpdate(cartId,{$set:{items:items.splice(items[i],1),totalItems:totalItems,totalPrice:totalprice}},{new:true})
// //     return res.status(200).send({status:false,msg:"update sucessfull",data:updatedata})
// //   }/*else{
    
    
// //     const updatedata=await cartmodel.findByIdAndUpdate(cartId,{$inc:{items[i].quantity:quantity-1}},{new:true})
// //     return res.status(200).send({status:false,msg:"update sucessfull",data:updatedata})
// //   }*/
// // }
// // }

// // }
exports.updatecart = async function (req, res) {
  try {
      let data = req.body;
      let userId = req.params.userId;
     // if (!v.isvalidRequest(data)) return res.status(400).send({ status: false, message: "Please Enter data" })
      
      let { cartId, productId, removeProduct } = data;
      
     // if (!v.isValidObjectId(userId)) return res.status(400).send({ status: false, message: "Please Enter Valid User Id" })
      
      let userExist = await userModel.findById(userId);
      if (!userExist) return res.status(404).send({ status: false, message: "User not Found" })

      if (!productId) return res.status(400).send({ status: false, message: "Please Enter Product Id" })
     // if (!v.isValidObjectId(productId)) return res.status(400).send({ status: false, message: "Please Enter valid Product Id" })
      
      let product = await productModel.findById(productId);
      if (!product) return res.status(404).send({ status: false, message: "Product not found" })

      if (!(removeProduct || removeProduct == 0)) {
          return res.status(400).send({ status: false, message: "Provide the removeProduct Key" })
      }
      // if (!(typeof removeProduct == "number")) {
      //     return res.status(400).send({ status: false, message: "RemoveProduct should be Number" })
      //}
      if (!(removeProduct == 1 || removeProduct == 0))
          return res.status(400).send({ status: false, message: "Please Enter RemoveProduct Key 0 Or 1" })


      if (!cartId) return res.status(400).send({ status: false, message: "Please Enter Cart Id" })
     // if (!v.isValidObjectId(cartId)) return res.status(400).send({ status: false, message: "Please Enter valid cart Id" })
      let cartExist = await cartmodel.findById(cartId);

      let flag = false; //using flag variable 
      if (cartExist) {
          if (cartExist.items.length == 0) { return res.status(400).send({ status: false, message: "NO Items Present In Cart" }) }
          for (let i = 0; i < cartExist.items.length; i++) {
              if (cartExist.items[i].productId == productId && cartExist.items[i].quantity > 0) {
                  if (removeProduct == 1) {
                      cartExist.items[i].quantity -= 1;
                      cartExist.totalPrice -= product.price;
                      if (cartExist.items[i].quantity == 0) {
                          cartExist.items.splice(i, 1)
                      }
                  } else if (removeProduct == 0) {
                      cartExist.totalPrice = cartExist.totalPrice - cartExist.items[i].quantity * product.price;
                      cartExist.items.splice(i, 1)
                  }

                  flag = true;
                  //updating the cart data 
                  cartExist.totalItems = cartExist.items.length;
                  let final = await cartmodel.findOneAndUpdate({ _id: cartId }, { $set: cartExist }, { new: true })
                  return res.status(200).send({ status: true, message: "Success", data: final });
              }
          }
          if (flag == false) {
              return res.status(404).send({ status: false, message: "No Product with this productId" })
          }
      } else { return res.status(404).send({ status: false, message: "Cart Not Found With This CartId" }) }
  } catch (err) { return res.status(500).send({ status: false, message: err.message }) }
}