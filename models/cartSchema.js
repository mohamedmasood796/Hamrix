// const mongoose = require("mongoose");

const { default: mongoose } = require("mongoose");

// const { default: mongoose } = require("mongoose");

// const Schema = mongoose.Schema;

// const productsSchema = new Schema({
//     productId: {
//         type: String,
//         required: true
//     },
//     quantity: {
//         type: Number,
//         required: true
//     },
//     price: {
//         type: String,
//         required: true
//     }, name: {
//         type: String,
//         required: true
//     },
//     orderStatus:{
//         type: String
//     }
// })
// const cartSchema = new Schema({
//     userId: {
//         type: String,
//         required: true
//     }, bill : {
//         type: String,
//         required: true
//     },
//     totalquantity:{
//         type: String,
//         required: true
//     },
//     items: [productsSchema]
// })

// module.exports = mongoose.model("carts", cartSchema);




const cartSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    products:[
        {
            productId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"product"
            },
            quantity:Number,
            name:String,
            price:Number,
        }
    ],
    total:{
        type:Number,
        default:0,
    }

})
module.exports=mongoose.model("cart",cartSchema);