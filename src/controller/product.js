const aws= require("aws-sdk")
const{uploadFile}=require("../aws/aws")
const productmodel=require('../models/productModel')


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
        const {title,description,price,currencyId,currencyFormat, availableSize}=data
        data.productImage=uploadedFileURL

    
    if(!title){return res.status(400).send({status:false,msg:"Please provide title"})}
    if(!description){return res.status(400).send({status:false,msg:"Please provide description"})}
    if(!price){return res.status(400).send({status:false,msg:"Please provide price"})}
    if(!currencyId){return res.status(400).send({status:false,msg:"Please provide currencyId"})}
    if(!currencyFormat){return res.status(400).send({status:false,msg:"Please provide currencyformate"})}
    if(!isValide(title)){return res.status(400).send({status:false,msg:'please enter valide titel'})}
    if(!isValide(description)){return res.status(400).send({status:false,msg:'please enter valide description'})}
    if(!isValide(currencyId)){return res.status(400).send({status:false,msg:'please enter valide currencyId'})}
     if(price)data.price=price+'₹'
    const arr=["S", "XS","M","X", "L","XXL", "XL"]
    if(availableSize){
        if(!arr.includes(availableSize)){return res.status(400).send({status:false,msg:"please enter size it should be like these ['S', 'XS','M,'X','L','XXL','XL']"})}
    }
    const arr1=['INR']
    if(!arr1.includes(currencyId)){return res.status(400).send({status:false,msg:'please enter only INR'})}
    if(currencyFormat!='₹'){return res.status(400).send({status:false,msg:"enter valide sybol"})}

    const titilexist=await productmodel.findOne({title:title})
    if(titilexist){return res.status(400).send({status:false,msg:'title is already exist'})}

    const createdata=await productmodel.create(data)
    return res.status(201).send({status:true,msg:"successfully",data:createdata})
    }catch(err){return res.status(500).send({status:false,msg:err.message})}

}


exports.getproduct = async function (req, res) {
    try {
      const data=req.query
      let newdata={}
      let obj={}
      if(data.size) newdata.availableSizes=data.size
      if(data.name) newdata.title=data.name 
      if(data.price)newdata.price=data.price
      if(data.priceGreaterThan) obj.$gt=data.priceGreaterThan+"₹"
      if(data.priceLessThan) obj.$lt=data.priceLessThan+"₹"
      console.log(newdata)
      if(data.priceGreaterThan || priceLessThan)newdata.price=obj
      let new2data={}
      if(data.priceshort==-1) new2data.price=-1
       new2data.price=1
      let finddata= await productmodel.find(newdata).sort(new2data)
      if(finddata.length==0) return res.status(404).send({status:false,msg:"data is not find"})
      return res.status(200).send({status:true,data:finddata})
    } catch (err) { return res.status(500).send({ status: false, msg: err.message }) }
  
  
  }


