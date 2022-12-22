const aws= require("aws-sdk")
const{uploadFile}=require("../aws/aws")
const productmodel=require('../models/productModel')
const mongoose=require('mongoose')
const objectId=mongoose.Types.ObjectId

function isValide(value) {
    return (typeof value === "string" && value.trim().length > 0 && value.match(/^[A-Za-z ][A-Za-z _]{1,100}$/));
}
//  function isValidprice(value){
//     return (typeof value === "number" &&  value.trim().length > 0 && value.match(/^[0-9]{10}$/))
//   }

exports.createproduct=async function(req,res){
  try{
      const files=req.files
      if(files && files.length==0) return res.status(400).send({status:false,msg:"files are empty"})
      let uploadedFileURL= await uploadFile( files[0] )
      const data=req.body
      const {title,description,price,currencyId,currencyFormat,availableSizes}=data
      
      data.productImage=uploadedFileURL

   
  if(!title){return res.status(400).send({status:false,msg:"Please provide title"})}
  if(!description){return res.status(400).send({status:false,msg:"Please provide description"})}
  if(!price){return res.status(400).send({status:false,msg:"Please provide price"})}
  if(!currencyId){return res.status(400).send({status:false,msg:"Please provide currencyId"})}
  if(!currencyFormat){return res.status(400).send({status:false,msg:"Please provide currencyformate"})}
  if(!isValide(title)){return res.status(400).send({status:false,msg:'please enter valide titel'})}
  if(!isValide(description)){return res.status(400).send({status:false,msg:'please enter valide description'})}
  if(!isValide(currencyId)){return res.status(400).send({status:false,msg:'please enter valide currencyId'})}
   if(price)data.price=price
  const arr=["S", "XS","M","X", "L","XXL", "XL"]
  
    const arrsize= availableSizes.split(",").map(x=>x.trim())
  if(availableSizes){
      for(let i=0; i<arrsize.length; i++){ 
       
      if(!arr.includes(arrsize[i])){
      
        return res.status(400).send({status:false,msg:"please enter size it should be like these ['S', 'XS','M,'X','L','XXL','XL']"})}
        data.availableSizes=arrsize
      }
     
  }
  const arr1=['INR']
  if(!arr1.includes(currencyId)){return res.status(400).send({status:false,msg:'please enter only INR'})}
  if(currencyFormat!='₹'){return res.status(400).send({status:false,msg:"enter valide symbol"})}

  const titilexist=await productmodel.findOne({title:title})
  if(titilexist){return res.status(400).send({status:false,msg:'title is already exist'})}

  const createdata=await productmodel.create(data)
  return res.status(201).send({status:true,msg:"successfully",data:createdata})
  }catch(err){return res.status(500).send({status:false,msg:err.message})}

}



exports.getproduct = async function (req, res) {
  try {
    const data=req.query
    let newdata={isDeleted:false}
    
    if(data.size) newdata.availableSizes=data.size
    if(data.name) newdata.title=data.name 
    if(data.price)newdata.price=data.price
    let new2data={}
    if(data.priceshort==-1) new2data.price=-1
     new2data.price=1
     let abc={}
    if(data.priceGreaterThan||data.priceLessThan){
      if(data.priceGreaterThan) abc.$gt=data.priceGreaterThan
      if(data.priceLessThan) abc.$lt=data.priceLessThan
      console.log(abc)
        newdata.price=abc
      // let pricedata=await productmodel.find({price:abc,isDeleted:false}).sort(new2data)
      // return res.status(200).send({status:true,data:pricedata})

    }
   
    let finddata= await productmodel.find(newdata).sort(new2data)
    if(finddata.length==0) return res.status(404).send({status:false,msg:"data is not find"})
    return res.status(200).send({status:true,data:finddata})
  } catch (err) { return res.status(500).send({ status: false, msg: err.message }) }


}


  
  exports.getProductbyid = async function(req,res){
    try{
  
    let productId= req.params.productId
    if(!objectId(productId)) return res.status(400).send({status:false, msg: "invalid productId" })
  
    let product = await productmodel.findOne({isDeleted:false, _id: productId})
    if(!product) return res.status(404).send({status:false, msg: "product not found"})
    
    return res.status(200).send({status:true, data: product})
  }
  catch(error){
    return res.status(500).send({status: false, message: error.message})
  }
  }

  /***********************************************************updateproduct***************************************************************************8 */
exports.updateProduct = async function(req,res){
    try{
    let productId = req.params.productId
     let data = req.body
     const obj={}
     
    if(!objectId(productId)) return res.status(400).send({status:false, msg: "invalid productId" })
    let{title,description,price,currencyId,currencyFormat,style,availableSizes,installments} = data
   
    const files=req.files
    if(files && files.length!=0){
    let uploadedFileURL= await uploadFile( files[0] )
     obj.productImag=uploadedFileURL
     } 
   
     if(title){
    if(!isValide(title)){return res.status(400).send({status:false,msg:'please enter valide titel'})}
       const titlexist=await productmodel.findOne({title:title})
       if(titlexist){return res.status(400).send({status:false,msg:"title is already existing"})}
       obj.title=title
     }
     if(description){
    if(!isValide(description)){return res.status(400).send({status:false,msg:'please enter valide description'})}
      obj.description=description
     }
    if(price){
        obj.price=price
    }
    if(style){
        obj.style=style
    }
    if(installments){
        obj.installments=installments
    }
    const arr=["S", "XS","M","X", "L","XXL", "XL"]
    if(availableSizes){
       if(!arr.includes(availableSizes)){
        return res.status(400).send({status:false,msg:"please enter size it should be like these ['S', 'XS','M,'X','L','XXL','XL']"})}}
        const arr1=['INR']
        if(currencyId){
        if(!arr1.includes(currencyId)){return res.status(400).send({status:false,msg:'please enter only INR'})}}
        if(currencyFormat){
        if(currencyFormat!='₹'){return res.status(400).send({status:false,msg:"enter valide sybol ₹"})}
         
        }
    
        let updateData = await productmodel.findOneAndUpdate({_id:productId,isDeleted:false},{$set:obj,$push:{availableSizes:data.availableSizes}},{new:true})
        if(!updateData) return res.status(404).send({status:false, msg: "product not found"})
        return res.status(200).send({status: true, msg: "dataupdated", data:updateData })
    
    }
    catch(error){
        return res.status(500).send({status:false, message: error.message})
    }
    }


  // ---------------------------------delete product byId--------------

exports.deleteProductById= async (req,res) => {
    try{
        const productId = req.params.productId

        if(!objectId.isValid(productId)){return res.status(400).send({ status: false, message:"please enter valid productId in params"})}

        const deletedProduct = await productmodel.findOneAndUpdate(
           { _id:productId,isDeleted:false },{ $set: { isDeleted: true, deletedAt: new Date()}}, { new: true } );
        if(!deletedProduct){ return res.status(400).send({ status: false, mesaage:"product has been already deleted"});}
        return  res.status(200).send({ status: true, message:"Successfully" });

       }catch(err){
        res.status(500).send({ status: false, message: err.message});
       }

};









