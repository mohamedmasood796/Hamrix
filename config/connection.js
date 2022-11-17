require('dotenv').config()
const mongoose= require('mongoose')

mongoose.connect(process.env.MONGO_ATLES)

mongoose.connection
    .once("open",()=> console.log("connected"))
    .on("error",error=>{
        console.log("your Error",error)
    })