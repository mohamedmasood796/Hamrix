
module.exports={
     verifyLogin:(req,res,next)=>{
        if(req.session.userloggedIn){
            next()
        }else{
            res.redirect('/user-login')
        }
    }
}
