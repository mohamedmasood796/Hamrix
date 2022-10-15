const userModel= require ('../models/user')
const bcrypt = require('bcrypt')
const { USER_COLLECTION } = require('../config/collection')


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
//--------------------user login post --------------------

    getUserLoginPost:async(req,res)=>{
        console.log(req.body)
        let user= await userModel.findOne({userEmail:req.body.email})
        if(user){
            bcrypt.compare(req.body.password,user.password).then((data)=>{
                if(data){
                    console.log("first if")
                    res.redirect('/')
                }else{
                    console.log("2 if")
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
                const userName = req.body.username
                const userEmail = req.body.email
                const phone = req.body.phone
                const password=await bcrypt.hash(req.body.password,10)
                const user =new userModel ({
                    userName:userName, 
                    userEmail:userEmail,
                    phone:phone,
                    password:password

                })
                console.log(user)
                user.save()
                .then(result=>{
                    res.redirect('/')
                })
                .catch(err=>{
                    console.log(err)
                }) 
            }else{
                res.redirect('/user-login')
            }
        })
        
    }
}