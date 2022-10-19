const userModel= require ('../models/user')
const bcrypt = require('bcrypt')
const product =require('../models/productSchema')
const { USER_COLLECTION } = require('../config/collection')

// const userSession=(req,res,next)=>{
//     if (req.session.userloggedIn) {
//         next()
//     } else {
//         res.render('user/user-')
//     }
// }

module.exports={
    getUserHome :(req,res)=>{
        // product.find({}, function (err, result) {
        //     if (err) {
        //         res.send(err);
        //     } else {
        //         res.render('user/user-home',{user:req.session.user,result})
                
        //     }
        // });

        return new Promise(async(resolve,reject)=>{
            await product.find().then((result)=>{
                resolve(result)
            })
        }).then((result)=>{
            if(result) {
                res.render('user/user-home',{user:req.session.user,result})
            } else {
                res.redirect("/")
            }

        })
    },

    getUserLogin:(req,res)=>{
        if(req.session.userloggedIn){
            let user=req.session.user
        res.redirect('/')
        }else{
            res.render('user/user-login',{loginErr:req.session.loginErr})
            req.session.loginErr=false
        }
    },

    getUserSignup:(req,res)=>{
        if(req.session.userloggedIn){
            res.redirect('/')
        }else{
            res.render('user/user-signup')
            
        }
 
    },
//--------------------user login post --------------------

    getUserLoginPost:async(req,res)=>{
        let user= await userModel.findOne({userEmail:req.body.email})
        if(user.access){
            if(user){
                bcrypt.compare(req.body.password,user.password).then((data)=>{
                    if(data){
                        req.session.userloggedIn=true
                        req.session.user=user
                        res.redirect('/')
                    }else{
                        req.session.loginErr=true
                        res.redirect('/user-login')
                    }
                })
            }else{
                console.log("4if")
                res.redirect('/user-login')
            }
        }else{
        loginErr="YOU ARE BLODED BY ADMIN"
        res.redirect('/user-login')
        }
    },
//---------------------usre signup post methord

    getUserSignupPost:(req,res)=>{
        userModel.find({userEmail:req.body.email},async(err,data)=>{
            if(data.length==0){
                const userNameka = req.body.username
                const userEmailka = req.body.email
                const phoneka = req.body.phone
                const confirmpasswordka=req.body.ConfirmPassword 
                let passwordka=req.body.password
                
                //passwordka=await bcrypt.hash(passwordka,10)
            
                if(passwordka==confirmpasswordka){
                passwordka=await bcrypt.hash(passwordka,10)
                const user =new userModel ({
                    userName:userNameka, 
                    userEmail:userEmailka,
                    phone:phoneka,
                    password:passwordka,
                    access:true
                })
                
                console.log(user)
                user.save()
                .then(result=>{
                    req.session.userloggedIn=true
                    req.session.user=user
                    res.redirect('/')
                })
                .catch(err=>{
                    console.log(err)
                }) 
            }else{
                res.redirect('/user-signup')
            }
        }})   
    },

    //--------------------------secssion distroy

    getUserLogout:(req,res)=>{
        req.session.destroy()
        res.redirect('/')
    }


    // getUserLoginhome:(req,res)=>{
    //     console.log("userlog")
    //     res.redirect('/user-login')
    // }
}