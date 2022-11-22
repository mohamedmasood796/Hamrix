
module.exports={
    verifyLogin:(req,res,next)=>{
       if(req.session.userloggedIn){
           next()
       }else{
           res.redirect('/user-login')
       }
   }
}



const userSchema = require('../models/user')

module.exports={
    userBlock:async(req,res,next)=>{
        let userData= req.session.user
        console.log('arshhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh')
        console.log(userData)
        let user= await userSchema.findOne({_id:userData._id})
        console.log('arshad')
        console.log(user);
        if(user.access ==="true"){
            next()
        }else{
            req.session.userloggedIn=null
            res.redirect('/user-login')
        }
    }
}