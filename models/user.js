const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let userSchema = new Schema({
    userName: {
      type: String,
      required:true
    },
    userEmail: {
      type: String,
      required:true
    },
    phone: {
      type: String,
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