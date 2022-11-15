module.exports={
    verifyLoggedIn:(req,res,next)=>{
       if(req.session.adminloggedIn){
           next()
       }else{
           res.redirect('/admin-login')
       }
   }
}
