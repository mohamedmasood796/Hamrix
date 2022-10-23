const userModel= require ('../models/user')
const bcrypt = require('bcrypt')
const product =require('../models/productSchema')
const { USER_COLLECTION } = require('../config/collection')
const user = require('../models/user')
const cartSchema = require('../models/cartSchema')


// const userSession=(req,res,next)=>{
//     if (req.session.userloggedIn) {
//         next()
//     } else {
//         res.render('user/user-')
//     }
// }

let loginErr;

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
            await product.find({access:true}).limit(8).then((result)=>{
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
            res.render('user/user-login',{loginErr})
            loginErr=null
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
        
            if(user){
                if(user.access){
                    console.log('acdess')
                bcrypt.compare(req.body.password,user.password).then((data)=>{
                    if(data){
                        req.session.userloggedIn=true
                        req.session.user=user
                        res.redirect('/')
                        console.log("3 if")
                    }else{
                        loginErr = "Invalid Password"
                        res.redirect('/user-login')
                        console.log('3 else')
                    }
                })
            }else{
                loginErr = "You are blocked by admin"
                console.log("4if")
                res.redirect('/user-login')
            }
        }else{
        loginErr="Invalid Email"
        console.log('last else')
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
    },

    getUserProfileshow:(req,res)=>{
        let user= req.session.user
       
        res.render('user/user-profileEdit',{user})

    },

    getUserProfilePage:(req,res)=>{
        let user=req.session.user
        res.render('user/user-profilePage',{user})
    },
    getUserEditProfile:async(req,res)=>{
        let userId =req.session.user._id
        let userww=req.session.user
        let kkkk=await user.findByIdAndUpdate({_id: userId},{
            
            userName: req.body.userName,
            lastName:req.body.lastName,
            userEmail:req.body.email,
            address: {
                address:req.body.address,
                state:req.body.state,
                zipCode:req.body.zipCode,
                country:req.body.country,
            },
            phone:req.body.phone,
        })
        console.log(kkkk)
        req.session.user=await user.findOne({_id: userId})
        res.redirect('/')
    },

    getOnePageProduct:async(req,res)=>{
        let user = req.session.user
        const proId=req.params.id
        // console.log(user)
        console.log(proId)
        let products = await product.findById(proId)
        console.log(products)

        res.render('user/user-productOnePage',{ products,user })
    },

    getUserOtpPage:(req,res)=>{
        res.render('user/user-otp')
    },

    otpToHome:(req,res)=>{
        res.redirect('/')
    },

    getUserAllProduct:(req,res)=>{
        let user=req.session.user
        product.find({},(err,result)=>{
            if(err){
                console.log(err)
            }else{
                res.render('user/user-shop',{user,result})
            }
        })
        
    },


    // getUserCart : async (req,res) => {
    //     if(req.session.user){
    //        const getUserId = req.session.user._id 
    //         proId = req.params.proId
    //         const userCart = await cartSchema.findOne({user :getUserId}).lean()
    //         if(userCart){
    //             cartSchema.findOneAndUpdate(
    //                 { user: getUserId }, 
    //                 { $push: { products: proId } }
                    
    //             ) 
    //         }else{
    //             const newCart = new cartSchema({
    //                 user :getUserId,
    //                 products : proId
    //             })
    //             newCart.save()
    //         }
    //     }else{
    //         res.redirect('/user-login')
    //     }
      
    // },




    getUserCart:async(req,res)=>{
        
        if(req.session.user){

            const getUserId=req.session.user._id
            let proId=req.params.id
            const userCart=await cartSchema.findOne({user:getUserId}).lean()
            let arr = [...userCart.products]
            if(userCart){
                arr.push(proId);
                cartSchema.updateOne(
                    {user:getUserId},
                    {$set: {"products": arr}}
                )
                .then(data => {
                    console.log(data)
                })

            }else{
                const newCart = new cartSchema({
                    user:getUserId,
                    products:proId
                })
                newCart.save()
            }
        }else{
            res.redirect('/user-login')
        }
        
    },



    getproductAddToCart:async(req,res)=>{
        const proId=req.params.id
        const newUserId=req.session.user.id

        return new Promise(async(resolve,reject)=>{
            let usercart=await cart.findOne({userId:newUserId})
            if(usercart){

            }else{
                let cartobj={
                    user:newUserId,
                    
                }
            }
        })



        // let usercart= await cart.findOne({userId:newUserId})
        // if(usercart){

        // }else{
        //     let cartobj={
        //         user:newUserId,
        //         products:[proId]
        //     }
        //     cart.insertOne(cartobj )
        // }

    }




    // getUserLoginhome:(req,res)=>{
    //     console.log("userlog")
    //     res.redirect('/user-login')
    // }
}