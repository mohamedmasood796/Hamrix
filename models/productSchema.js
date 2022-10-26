const mongoose=require('mongoose')
const Schema=mongoose.Schema
const productSchema=new Schema({
    name:{
        type:String,    
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    quantity:{
        type:Number,
        require:true
    },
    category:{
        type:String,
        required:true
    },
    image:{
        type:Array,
        required:true
    },
    access:{
        type:Boolean,
        required:true
      }
      
})
module.exports=mongoose.model('products',productSchema)