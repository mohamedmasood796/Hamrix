const mongoose= require('mongoose')

mongoose.connect("mongodb://localhost:27017/hamrix",{useNewUrlParser : true})

mongoose.connection
    .once("open",()=> console.log("connected"))
    .on("error",error=>{
        console.log("your Error",error)
    })