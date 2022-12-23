const { type } = require("express/lib/response");
const mongoose = require("mongoose")
const ObjectId= mongoose.Schema.Types.ObjectId

const cartSchema = new mongoose.Schema({
  userId:{
    type: ObjectId,
    ref: "User",
    required: true,
    unique: true
  },
  items:[{
    productId:{
        type: ObjectId,
        ref: "product",
        required: true

    },
    quantity: {
        type: Number,
        required: true
    }
  }],

  totalPrice:{
    type:Number,
    rquired: true,
    comment: "Holds total price of all the item in the cart"
  },
  totalItems:{
    type: Number,
    required: true,
    comment: "Hold total number of items in the cart"
  }
},{ timestamps: true});



module.exports = mongoose.model('Carts',cartSchema)

