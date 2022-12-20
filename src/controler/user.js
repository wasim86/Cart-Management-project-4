const aws= require("aws-sdk")
const{uploadFile}=require("../aws/aws")
const usermodel=require("../models/userModel")
const bcrypt=require("bcrypt")

const isValidEmail = function (value) {
    let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-z\-0-9]+\.)+[a-z]{2,}))$/;
    if (emailRegex.test(value)) return true;
  };

  const isValidPassword = function (pw) {
    let pass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,15}$/;
    if (pass.test(pw)) return true;
  };

  function isValideMobile(value){
    return (typeof value === "string" &&  value.trim().length > 0 && value.match(/^[0-9]{10}$/))
  }
  function isValidpin(value){
    return (typeof value === "string" &&  value.trim().length > 0 && value.match(/^[0-9]{6}$/))
  }

  
 
exports.create=async function(req,res){
    try {
    let files= req.files
    if(!files &&files.length==0) return res.status(400).send({status:false,msg:"files are empty"})
    let uploadedFileURL= await uploadFile( files[0] )

  
    let data=req.body
    
    let{fname,lname,email,phone,password,address}=data
    data.profileImage=uploadedFileURL
    if(!fname) return res.status(400).send({status:false,msg:"fname is mendatory"})
    if(!lname) return res.status(400).send({status:false,msg:"lname is mendatory"})
    if(!email) return res.status(400).send({status:false,msg:"email is mendatory"})
    if(!phone) return res.status(400).send({status:false,msg:"phone is mendatory"})
    if(!password) return res.status(400).send({status:false,msg:"password is mendatory"})
    if(address){
      data.address=JSON.parse(address)
        if (!data.address.shipping.street) return res.status(400).send({ status: false, message: "Shipping Street is required!" });


        if (!data.address.shipping.city) return res.status(400).send({ status: false, message: "Shipping City is required!" });


        if (!data.address.shipping.pincode) return res.status(400).send({ status: false, message: "Shipping Pincode is required!" })
        if (!isValidpin(data.address.shipping.pincode)) return res.status(400).send({ status: false, msg: " invalid  pincode " })
        

        if (!data.address.billing.street) return res.status(400).send({ status: false, message: "Billing Street is required!" });

        if (!data.address.billing.city) return res.status(400).send({ status: false, message: "Billing City is required!" });

        if (!data.address.billing.pincode) return res.status(400).send({ status: false, message: "Billing Pincode is required!" });
        
        if (!isValidpin(data.address.billing.pincode)) return res.status(400).send({ status: false, msg: " invalid  pincode " })
   }
 
    
    let phoneno=await usermodel.findOne({phone:phone}) 
    if(phoneno)return res.status(400).send({status:false,msg:"phone should be unique"})
    
    let emailid=await usermodel.findOne({email:email})
    if(emailid) return res.status(400).send({status:false,msg:"email should be unique"})
    
    if(!isValidEmail(email))return res.status(400).send({status:false,msg:"email is not valid"})
    if(!isValidPassword(password))return res.status(400).send({status:false,msg:"password is not valid"})
    if(!isValideMobile(phone))return res.status(400).send({status:false,msg:"phone is not valid"})
    const salt = await bcrypt.genSalt(10)
    const secPass =await bcrypt.hash(password,salt)
    data.password=secPass
    const createdata= await usermodel.create(data)
    

     return res.status(201).send({status:true,msg:"sucessfull creaction",data:createdata})    
    } catch (error) {
        return res.status(500).send({status:false,msg:error.message})
    }
}


exports.getuser=async function(req,res){
  try{const userid=peq.params.userId

  if(!objectId.isValid(userid)){return res.status(400).send({status:false,msg:"please enter valide id"})}
  const data=await usermodel.findById(userid)
  if(!data){return res.status(400).send({status:false,msg:"userid is not valid"})}
  res.status(200).send({status:true,msg:'User profile details',data:data})
  }catch(err){return res.status(500).send({status:false,msg:err.message})}

  
}

exports.updateuser=async function(req,res){
  try{const userid=req.params.userId
  if(!objectId.isValid(userid)){return res.status(400).send({status:false,msg:"please enter valide userid"})}
  const data=req.files
  const {fname,lname,email,phone,password}=data
  if(fname){
    if(!isValide(fname)){return res.status(400).send({status:false,msg:"Please enter valide fname"})}
    data.fname=fname
  }
  if(lname){
    if(!isValide(lname)){return res.status(400).send({status:false,msg:"Please enter valide lname"})}
    data.lname=lname
  }
  if(email){
    if(!isValidEmail(email)){return res.status(400).send({status:false,msg:"Please enter valide email"})}
    data.email=email
  }
  if(phone){
    if(!isValideMobile(phone)){return res.status(400).send({status:false,msg:"Please enter valide phone"})}
    data.phone=phone
  }
  if(password){
    if(!isValidPassword(password)){return res.status(400).send({status:false,msg:"Please enter valide password"})}
    const salt = await bcrypt.genSalt(10)
    const secPass =await bcrypt.hash(password,salt)
    data.password=secPass
  }
  if(files.address.shipping.street){
    let street=files.billing.address.street
    if(!isValide(street)){return res.status(400).send({status:false,msg:"Please enter valide street"})}
     data.address.shipping.street=street
  }
  if(files.address.address.city){
    let city=files.billing.address.city
    if(!isValide(city)){return res.status(400).send({status:false,msg:"Please enter valide city"})}
    data.billing.address.city=city
  }
  if(files.address.address.pincode){
    let pincode=files.billing.address.pincode
    if(!isValide(pincode)){return res.status(400).send({status:false,msg:"Please enter valide pincode"})}
    data.billing.address.pincode=pincode
  }

  if(files.billing.shipping.street){
    let street=files.billing.address.street
    if(!isValide(street)){return res.status(400).send({status:false,msg:"Please enter valide street"})}
    data.billing.address.street=street
  }
  if(files.billing.address.city){
    let city=files.billing.address.city
    if(!isValide(city)){return res.status(400).send({status:false,msg:"Please enter valide city"})}
    data.billing.address.city=city
  }
  if(files.billing.address.pincode){
    let pincode=files.billing.address.pincode
    if(!isValide(pincode)){return res.status(400).send({status:false,msg:"Please enter valide pincode"})}
    data.billing.address.pincode=pincode
  }


  const emailvalid=await usermodel.findOne({email:email})
  if(emailvalid){return res.status(409).send({status:false,msg:"email is already existing"})}
  const phonevalid=await usermodel.findOne({email:email})
  if(phonevalid){return res.status(409).send({status:false,msg:"phone is already existing"})}
 
  const updatedata=await usermodel.findByIdAndUpdate(userid,{$set:data},{new:true})
  if(!updatedata){return res.status(404).send({status:false,msg:"userid is not exist"})}
  return res.status(200).send({status:true,msg:"User profile updated",data:updatedata})
}catch(err){return res.status(500).send({status:false,msg:err.message})}
}

