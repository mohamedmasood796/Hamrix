const userModel= require ('../models/user')
const bcrypt = require('bcrypt')
const { USER_COLLECTION } = require('../config/collection')


module.exports={
    getUserHome :(req,res)=>{
        let user=req.session.user
        res.render('user/user-home',{user})
    },

    getUserLogin:(req,res)=>{
        let user=req.session.user
        res.render('user/user-login',{user})
    },

    getUserSignup:(req,res)=>{
        res.render('user/user-signup')
    },
//--------------------user login post --------------------

    getUserLoginPost:async(req,res)=>{
        console.log(req.body)
        let user= await userModel.findOne({userEmail:req.body.email})
        if(user){
            bcrypt.compare(req.body.password,user.password).then((data)=>{
                if(data){
                    req.session.userloggedIn=true
                    req.session.user=user
                    res.redirect('/')
                }else{
                    res.redirect('/user-login')
                }
            })
        }else{
            console.log("3 if")
        res.redirect('/user-login')
        }
    },
//---------------------usre signup post methord

    getUserSignupPost:(req,res)=>{
        console.log(req.body.password)
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
                    password:passwordka
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