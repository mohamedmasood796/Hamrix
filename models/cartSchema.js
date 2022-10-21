const mongoose = require('mongoose')
const Schema = mongoose.Schema
const productSchema = new Schema({
    ProductId: {
        type: String,
        required: true
    },
    ProductName: {
        type: String,
        required: true
    },
    Quantity: {
        type: Number,
        required: true
    },
    Price: {
        type: Number,
        required: true
    },

})
const cartSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    Products: [productSchema],
    subTotal: {
        type: Number,
        required: true
    }

})
module.exports=mongoose.model('cart',cartSchema)