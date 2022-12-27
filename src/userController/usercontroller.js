const { default: mongoose} = require("mongoose")
const objectId=mongoose.Types.ObjectId

exports.getuser=async function(req,res){
    try{const userid=peq.params.userId

    if(!objectId.isValid(userid)){return res.status(400).send({status:false,msg:"please enter valide id"})}
    const data=await userModel.findById(userid)
    if(!data){return res.status(400).send({status:false,msg:"userid is not valid"})}
    res.status(200).send({status:true,msg:'User profile details',data:data})
    }catch(err){return res.status(500).send({status:false,msg:err.message})}

    
}



