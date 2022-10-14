module.exports={
    getUserHome :(req,res)=>{
        res.render('user/user-home')
    },

    getUserLogin:(req,res)=>{
        res.render('user/user-login')
    },

    getUserSignup:(req,res)=>{
        res.render('user/user-signup')
    },

    getUserLoginPost:(req,res)=>{
        console.log(req.body)
        res.redirect('/')
    },

    getUserSignupPost:(req,res)=>{
        res.redirect('/')
    }
}