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
    phoneNo: {
      type: String,
      required:true
    },
    password:{
        type:String,
        required:true
    },

  });

  mongoose.exports=mongoose.model('user',userSchema)