const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const addresDetailsSchema = new Schema({
    name: {
        type: String,
    },
    phoneNo: {
        type: String,
    },
    address: {
        type: String,
    },
    city: {
        type: String,
    },
    country: {
        type: String,
    },
    state: {
        type: String,
    },
    zip: {
        type: String,
    },
    payment: {
        type: String,
    }

    
})

const addressSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    address: [addresDetailsSchema]
})


module.exports = mongoose.model( 'address',addressSchema );