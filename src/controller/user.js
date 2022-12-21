const aws = require("aws-sdk")
const { uploadFile } = require("../aws/aws")
const usermodel = require("../models/userModel")
const bcrypt = require("bcrypt")
const { default: mongoose } = require("mongoose")
const objectId = mongoose.Types.ObjectId
const isValidEmail = function (value) {
  let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-z\-0-9]+\.)+[a-z]{2,}))$/;
  if (emailRegex.test(value)) return true;
};

const isValidPassword = function (pw) {
  let pass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,15}$/;
  if (pass.test(pw)) return true;
};

function isValideMobile(value) {
  return (typeof value === "string" && value.trim().length > 0 && value.match(/^[0-9]{10}$/))
}
function isValidpin(value) {
  return (typeof value === "string" && value.trim().length > 0 && value.match(/^[0-9]{6}$/))
}
function isValide(value) {
  return (typeof value === "string" && value.trim().length > 0 && value.match(/^[A-Za-z ][A-Za-z _]{1,100}$/));
}


exports.create = async function (req, res) {
  try {
    let files = req.files
    if (!files && files.length == 0) return res.status(400).send({ status: false, msg: "files are empty" })
    let uploadedFileURL = await uploadFile(files[0])


    let data = req.body

    let { fname, lname, email, phone, password, address } = data
    data.profileImage = uploadedFileURL
    if (!fname) return res.status(400).send({ status: false, msg: "fname is mendatory" })
    if (!lname) return res.status(400).send({ status: false, msg: "lname is mendatory" })
    if (!email) return res.status(400).send({ status: false, msg: "email is mendatory" })
    if (!phone) return res.status(400).send({ status: false, msg: "phone is mendatory" })
    if (!password) return res.status(400).send({ status: false, msg: "password is mendatory" })
    if (address) {
      data.address = JSON.parse(address)
      if (!data.address.shipping.street) return res.status(400).send({ status: false, message: "Shipping Street is required!" });


      if (!data.address.shipping.city) return res.status(400).send({ status: false, message: "Shipping City is required!" });


      if (!data.address.shipping.pincode) return res.status(400).send({ status: false, message: "Shipping Pincode is required!" })
      if (!isValidpin(data.address.shipping.pincode)) return res.status(400).send({ status: false, msg: " invalid  pincode " })


      if (!data.address.billing.street) return res.status(400).send({ status: false, message: "Billing Street is required!" });

      if (!data.address.billing.city) return res.status(400).send({ status: false, message: "Billing City is required!" });

      if (!data.address.billing.pincode) return res.status(400).send({ status: false, message: "Billing Pincode is required!" });

      if (!isValidpin(data.address.billing.pincode)) return res.status(400).send({ status: false, msg: " invalid  pincode " })
    }


    let phoneno = await usermodel.findOne({ phone: phone })
    if (phoneno) return res.status(400).send({ status: false, msg: "phone should be unique" })

    let emailid = await usermodel.findOne({ email: email })
    if (emailid) return res.status(400).send({ status: false, msg: "email should be unique" })

    if (!isValidEmail(email)) return res.status(400).send({ status: false, msg: "email is not valid" })
    if (!isValidPassword(password)) return res.status(400).send({ status: false, msg: "password is not valid" })
    if (!isValideMobile(phone)) return res.status(400).send({ status: false, msg: "phone is not valid" })
    const salt = await bcrypt.genSalt(10)
    const secPass = await bcrypt.hash(password, salt)
    data.password = secPass
    const createdata = await usermodel.create(data)


    return res.status(201).send({ status: true, msg: "sucessfull creaction", data: createdata })
  } catch (error) {
    return res.status(500).send({ status: false, msg: error.message })
  }
}
/******************************************************LoginUser************************************************************* */
exports.login = async function (req, res) {
  try {
    let data = req.body;

    let { email, password } = data
    let userEmail = await usermodel.findOne({ email: email })
    if (!userEmail) return res.status(404).send({ status: false, msg: "email not found" })

    let userPassword = await bcrypt.compare(password, userEmail.password);
    if (!userPassword) return res.status(404).send({ status: false, msg: "password not found" })

    let token = jwt.sign({ userId: userEmail._id }, "project5")
    return res.status(201).send({ status: true, token: token })
  }
  catch (error) {
    return res.status(500).send({ status: false, message: error.message })
  }

}
/**********************************************getUserbyId*********************************************************************** */

exports.getuser = async function (req, res) {
  try {
    const userid = req.params.userId

    if (!objectId.isValid(userid)) { return res.status(400).send({ status: false, msg: "please enter valide id" }) }

    const data = await usermodel.findById(userid).lean()
    let { fname, lname, email, phone, password, address, _id } = data

    let newdata =
    {
      address: {
        shipping: {
          street: address.shipping.street,
          city: address.shipping.city,
          pincode: address.shipping.pincode
        },
        billing: {
          street: address.billing.street,
          city: address.billing.city,
          pincode: address.billing.pincode
        }
      },
      _id: _id,
      fname: fname,
      lname: lname,
      email: email,
      profileImage: data.profileImage,
      phone: phone,
      password: password,


    }

    if (!data) { return res.status(400).send({ status: false, msg: "userid is not valid" }) }

    res.status(200).send({ status: true, msg: 'User profile details', data: newdata })
  } catch (err) { return res.status(500).send({ status: false, msg: err.message }) }


}

/*************************************************updatebyId*****************************************************************8 */
exports.updateuser = async function (req, res) {
  try {
    const userid = req.params.userId
    if (!objectId.isValid(userid)) { return res.status(400).send({ status: false, msg: "please enter valide userid" }) }
    const data = req.body
    const { fname, lname, email, phone, password, address } = data
    if (fname) {
      if (!isValide(fname)) { return res.status(400).send({ status: false, msg: "Please enter valide fname" }) }
      data.fname = fname
    }
    if (lname) {
      if (!isValide(lname)) { return res.status(400).send({ status: false, msg: "Please enter valide lname" }) }
      data.lname = lname
    }
    if (email) {
      if (!isValidEmail(email)) { return res.status(400).send({ status: false, msg: "Please enter valide email" }) }
      data.email = email
    }
    if (phone) {
      if (!isValideMobile(phone)) { return res.status(400).send({ status: false, msg: "Please enter valide phone" }) }
      data.phone = phone
    }
    if (password) {
      if (!isValidPassword(password)) { return res.status(400).send({ status: false, msg: "Please enter valide password" }) }
      const salt = await bcrypt.genSalt(10)
      const secPass = await bcrypt.hash(password, salt)
      data.password = secPass
    }
    const useridvalid = await usermodel.findById(userid)
    if (address) {
      data.address = JSON.parse(address)
      if (!data.address.shipping.street) { return res.status(400).send({ status: false, msg: "if you want to change address you should fill all adress parts" }) }
      if (!isValide(data.address.shipping.street)) { return res.status(400).send({ status: false, msg: "Please enter valide street" }) }

      if (!data.address.shipping.city) { return res.status(400).send({ status: false, msg: "if you want to change address you should fill all adress parts" }) }
      if (!isValide(data.address.shipping.city)) { return res.status(400).send({ status: false, msg: "Please enter valide city" }) }


      if (!data.address.shipping.pincode) { return res.status(400).send({ status: false, msg: "if you want to change address you should fill all adress parts" }) }
      if (!isValidpin(data.address.shipping.pincode)) return res.status(400).send({ status: false, msg: " invalid  pincode " })


      if (!data.address.billing.street) { return res.status(400).send({ status: false, msg: "if you want to change address you should fill all adress parts" }) }

      if (!data.address.billing.city) { return res.status(400).send({ status: false, msg: "if you want to change address you should fill all adress parts" }) }


      if (!data.address.billing.pincode) { return res.status(400).send({ status: false, msg: "if you want to change address you should fill all adress parts" }) }


      if (!isValidpin(data.address.billing.pincode)) return res.status(400).send({ status: false, msg: " invalid  pincode " })
    }


    const emailvalid = await usermodel.findOne({ email: email })
    if (emailvalid) { return res.status(400).send({ status: false, msg: "email is already existing" }) }
    const phonevalid = await usermodel.findOne({ email: email })
    if (phonevalid) { return res.status(400).send({ status: false, msg: "phone is already existing" }) }


    const updatedata = await usermodel.findByIdAndUpdate(userid, { $set: data }, { new: true })
    if (!updatedata) { return res.status(404).send({ status: false, msg: "userid is not exist" }) }
    return res.status(200).send({ status: true, msg: "User profile updated", data: updatedata })
  } catch (err) { return res.status(500).send({ status: false, msg: err.message }) }
}

/**********************************************getProductby id************************************************/
exports.getProduct = async function(req,res){
  try{

  let productId= req.params.productId
  if(!objectId(productId)) return res.status(400).send({status:false, msg: "invalid productId" })

  let product = await productModel.findOne({isDeleted:false, _id: productId})
  if(!product) return res.status(404).send({status:false, msg: "product not found"})
  
  return res.status(200).send({status:true, data: product})
}
catch(error){
  return res.status(500).send({status: false, message: error.message})
}
}


