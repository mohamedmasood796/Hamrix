const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let addressSchema = new Schema({
  zipCode: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  country: {
    type: String,
    require: true
  },
  address: {
    type: String,
    required: true
  }
  
})

let userSchema = new Schema({
    userName: {
      type: String,
      required:true
    },
    lastName: {
      type: String,
    
    },
    userEmail: {
      type: String,
      required:true
    },
    phone: {
      type: String,
      required:true
    },
    address: [addressSchema],
    password:{
      type:String,
      required:true
    },
    password:{
        type:String,
        required:true
    },
    access:{
      type:Boolean,
      required:true
    }

  });

  module.exports=mongoose.model('User',userSchema)