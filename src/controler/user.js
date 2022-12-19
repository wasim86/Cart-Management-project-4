const aws= require("aws-sdk")
const{uploadFile}=require("../aws/aws")

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

exports.create=async function(req,res){
    try {
    let files= req.files
    if(!files &&files.length==0) return res.status(400).send({status:false,msg:"files are empty"})
    let uploadedFileURL= await uploadFile( files[0] )
    let data=req.body
    let{fname,lname,email,phone,password}=data
    if(!fname) return res.status(400).send({status:false,msg:"fname is mendatory"})
    if(!lname) return res.status(400).send({status:false,msg:"lname is mendatory"})
    if(!email) return res.status(400).send({status:false,msg:"email is mendatory"})
    if(!phone) return res.status(400).send({status:false,msg:"phone is mendatory"})
    if(!password) return res.status(400).send({status:false,msg:"password is mendatory"})
    if(!data.address.shipping.street) return res.status(400).send({status:false,msg:"street is mendatory"})
    if(!data.address.shipping.city) return res.status(400).send({status:false,msg:"city is mendatory"})
    if(!data.address.shipping.pincode) return res.status(400).send({status:false,msg:"pincode is mendatory"})
    if(!data.address.billing.street) return res.status(400).send({status:false,msg:"street is mendatory"})
    if(!data.address.billing.sity) return res.status(400).send({status:false,msg:"city is mendatory"})
    if(!data.address.billing.pincode) return res.status(400).send({status:false,msg:"pincode is mendatory"})
    
    let phoneno=await usermodel.findOne({phone:phone}) 
    if(phoneno)return res.status(400).send({status:false,msg:"phone should be unique"})
    
    let emailid=await usermodel.findOne({email:email})
    if(emailid) return res.status.send({status:false,msg:"email should be unique"})
    
    if(!isValidEmail(email))return res.status(400).send({status:false,msg:"email is not valid"})
    if(!isValidPassword(password))return res.status(400).send({status:false,msg:"password is not valid"})
    if(!isValideMobile(phone))return res.status(400).send({status:false,msg:"phone is not valid"})
    const salt = await bcrypt.genSalt(10)
    const secPass =await bcrypt.hash(password,salt)
     let newdata={fname:fname ,
        lname:lname,
        email:email ,
        profileImage:uploadedFileURL,
        phone:phone,
        password:secPass ,
        address:{
            shipping: {
              street:data.address.shipping.street,
              city:data.address.shipping.city,
              pincode:data.address.shipping.pincode
            },
            billing: {
              street: data.address.billing.street,
              city: data.address.billing.city,
              pincode:data.address.billing.pincode
            }
          }
     }

     const createdata= await usermodel.create(newdata)
     return req.status(201).send({status:true,msg:"sucessfull creaction",data:createdata})    
    } catch (error) {
        return res.status(500).send({status:false,msg:error.message})
    }
}