const mongoose = require("mongoose");

const  Schema = mongoose.Schema;

let adminSchema = new Schema({
    adminEmail: {
      type: String,
      required:true
    },
    password:{
        type:String,
        required:true
    },

  });

module.exports=mongoose.model('admin',adminSchema)