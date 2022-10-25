const userModel = require('../models/user')
const bcrypt = require('bcrypt')
const product = require('../models/productSchema')
const { USER_COLLECTION } = require('../config/collection')
const user = require('../models/user')
const cartSchema = require('../models/cartSchema')
const { aggregate } = require('../models/user')
const otpverification = require('../utils/otp-generator')
let loggedIn;

// const userSession=(req,res,next)=>{
//     if (req.session.userloggedIn) {
//         next()
//     } else {
//         res.render('user/user-')
//     }
// }

let loginErr;

module.exports = {
    getUserHome: (req, res) => {
        // product.find({}, function (err, result) {
        //     if (err) {
        //         res.send(err);
        //     } else {
        //         res.render('user/user-home',{user:req.session.user,result})

        //     }
        // });
        //=============================================================
        return new Promise(async (resolve, reject) => {
            await product.find({ access: true }).limit(8).then((result) => {
                resolve(result)
            })
        }).then((result) => {
            if (result) {
                // console.log(result);
                console.log(req.session.user)
                res.render('user/user-home', { user: req.session.user, result })
            } else {
                res.render("user/user-home")
            }

        })


        //========================================
        // if(loggedIn){
        //     let user=req.session.user
        //     product.find({},(err,result)=>{
        //         if(err){
        //             console.log(err)
        //         }else{
        //             res.render('user/user-home',{user,result})
        //         }
        //     })
        // }else{
        //     product.find({},(err,result)=>{
        //         if(err){
        //             console.log(err)
        //         }else{
        //             res.render('user/user-home',{user,result})
        //         }
        //     })
        // }
    },

    getUserLogin: (req, res) => {
        if (req.session.userloggedIn) {
            let user = req.session.user
            res.redirect('/')
        } else {
            res.render('user/user-login', { loginErr })
            loginErr = null
        }
    },

    getUserSignup: (req, res) => {
        if (req.session.userloggedIn) {
            res.redirect('/')
        } else {
            res.render('user/user-signup')

        }

    },
    //--------------------user login post --------------------

    getUserLoginPost: async (req, res) => {
        let user = await userModel.findOne({ userEmail: req.body.email })

        if (user) {
            if (user.access) {
                console.log('acdess')
                bcrypt.compare(req.body.password, user.password).then((data) => {
                    if (data) {
                        req.session.userloggedIn = true
                        req.session.user = user
                        res.redirect('/')
                        console.log("3 if")
                    } else {
                        loginErr = "Invalid Password"
                        res.redirect('/user-login')
                        console.log('3 else')
                    }
                })
            } else {
                loginErr = "You are blocked by admin"
                console.log("4if")
                res.redirect('/user-login')
            }
        } else {
            loginErr = "Invalid Email"
            console.log('last else')
            res.redirect('/user-login')
        }
    },
    //---------------------usre signup post methord

    // getUserSignupPost: (req, res) => {
    //     userModel.find({ userEmail: req.body.email }, async (err, data) => {
    //         if (data.length == 0) {
    //             const userNameka = req.body.username
    //             const userEmailka = req.body.email
    //             const phoneka = req.body.phone
    //             const confirmpasswordka = req.body.ConfirmPassword
    //             let passwordka = req.body.password


    //             console.log("ma")

    //             if (passwordka == confirmpasswordka) {
    //                 passwordka = await bcrypt.hash(passwordka, 10)
    //                 const user = new userModel({

    //                     userName: userNameka,
    //                     userEmail: userEmailka,
    //                     phone: phoneka,
    //                     password: passwordka,
    //                     access: true
    //                 })

    //                 console.log(user)
    //                 user.save()
    //                     .then(result => {
    //                         console.log("mas")

    //                         req.session.userloggedIn = true
    //                         req.session.user = user
    //                         res.redirect('/')
    //                     })
    //                     .catch(err => {
    //                         console.log(err)
    //                     })
    //             } else {
    //                 console.log("maoo")

    //                 res.redirect('/user-signup')
    //             }
    //         }
    //     })
    // },



    //--------------------------secssion distroy

    getUserLogout: (req, res) => {
        req.session.destroy()
        res.redirect('/')
    },

    getUserProfileshow: (req, res) => {
        let user = req.session.user
        console.log(user + 'amir')
        res.render('user/user-profileEdit', { user })

    },

    getUserProfilePage: (req, res) => {
        let user = req.session.user
        console.log('get :',user.address[0]);
        res.render('user/user-profilePage', { user })
    },
    getUserEditProfile: async (req, res) => {
        let userId = req.session.user._id
        console.log(userId + "kuta")
        let userutut = req.session.user
        console.log(req.body)
        let kkkk = await user.updateOne({ _id: userId }, {
            $set: {
                userName: req.body.firstName,
                lastName: req.body.lastName,
                userEmail: req.body.email,
                address: [{
                    address: req.body.address,
                    state: req.body.state,
                    zipCode: req.body.zipCode,
                    country: req.body.country,
                }],
                phone: req.body.phoneNumber,
            }

        }).then((data)=>{
            console.log(data);
        }
        )
        // console.log(kkkk)
        req.session.user = await user.findOne({ _id: userId })
        res.redirect('/')
    },

    getOnePageProduct: async (req, res) => {
        let user = req.session.user
        const proId = req.params.id
        // console.log(user)
        console.log(proId)
        let products = await product.findById(proId)
        console.log(products)

        res.render('user/user-productOnePage', { products, user })
    },


    //user sigin up
    getUserSiginupPage: (req, res) => {
        console.log("kkkkkkkkkkkkkkkkkk")
        console.log(req.body.email)

        const nna = userModel.find({ userEmail: req.body.email }, async (err, data) => {
            console.log(nna + "a;ljfhjfa")
            // console.log(userEmail)
            console.log("email")
            console.log(data)
            if (data.length == 0) {
                if (req.body.password === req.body.ConfirmPassword) {
                    const user = new userModel({
                        userName: req.body.username,
                        userEmail: req.body.email,
                        phone: req.body.phone,
                        password: await bcrypt.hash(req.body.password, 10),
                        access: true
                    })
                    req.session.otp = user//body ulla deltails thalkalikam save chayyan
                    console.log("started")
                    req.session.otpgenerator = otpverification.otpgeneratorto();//otp undakkan ayakkulla
                    console.log(req.session.otpgenerator)
                    //message sending
                    //otpverification.otpsender(req.session.otpgenerator)//opt message phonekk varan
                    //.then(()=>{
                    //   res.render('/user-otp')
                    //})

                    console.log('masood1')
                    res.render('user/user-otp')
                } else {
                    console.log('msood2')
                    Err = "password is not matched"
                    res.redirect('/user-signup')
                }
            } else {
                console.log('masood3')
                Err = "Invalied Email"
                res.render('user/user-otp')
            }
        })
    },

    //==================otp page home

    otpToHome:async (req, res) => {
        console.log(req.session.otpgenerator + "hari")

        if (req.session.otpgenerator === req.body.otp) {
            console.log('akljdsaaaaaaaaaaaaaaaaajlskd;;;;;;;;;')
            console.log(req.session.otp)
            let user = await userModel.create(req.session.otp)
            console.log(user+"ksdhfasbldagalhkgfalhk")
            req.session.user = user
            
            req.session.otp=null
                req.session.otpgenerator = null,
                loggedIn = true
            // req.session.userloggedIn = true
            // console.log(req.session.otp + "abu")

            res.redirect('/')

        } else {
            res.redirect('/user-signup')

        }

    },

    getUserAllProduct: (req, res) => {
        let user = req.session.user
        product.find({}, (err, result) => {
            if (err) {
                console.log(err)
            } else {
                res.render('user/user-shop', { user, result })
            }
        })

    },



    //=================add to cart first step================
    getUserCart: async (req, res) => {
        if (req.session.user) {
            const getUserId = req.session.user._id
            console.log("heyheyhey" + getUserId);
            proId = req.params.id
            console.log("madood" + proId)
            const userCart = await cartSchema.findOne({ user: getUserId }).lean()
            console.log(userCart + "mom")
            if (userCart) {
                console.log(proId);
                const newCart = await cartSchema.updateOne(
                    { user: getUserId }, //find chayyan
                    { $push: { products: proId } }//set chayyanulla data

                )

                res.redirect('/')
            } else {
                const newCart = new cartSchema({
                    user: getUserId,
                    products: proId
                })
                newCart.save()
                res.redirect('/')
            }
        } else {
            res.redirect('user/user-cart')
        }
    },


    getCartPage: async (req, res) => {
        if (req.session.user) {
            getUserId = req.session.user._id
            const prod = await cartSchema.aggregate([
                {
                    $match: { getUserId }
                },
                {
                    $lookup: {
                        from: 'products',
                        let: { proList: '$products' },  //$products=mongodb products ,it is from cart scheema
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $in: ['$_id', '$proList']
                                    }
                                }
                            }
                        ],
                        as: 'cartItems'
                    }
                }
            ]).toArray()
        } else {
            res.render('user/user-cart', { user })
        }

    },






    //============abu code=========

    // getUserCart:async(req,res)=>{

    //     if(req.session.user){

    //         const getUserId=req.session.user._id
    //         let proId=req.params.id
    //         const userCart=await cartSchema.findOne({user:getUserId}).lean()
    //         let arr = [...userCart.products]
    //         if(userCart){
    //             arr.push(proId);
    //             cartSchema.updateOne(
    //                 {user:getUserId},
    //                 {$set: {"products": arr}}
    //             )
    //             .then(data => {
    //                 console.log(data)
    //             })

    //         }else{
    //             const newCart = new cartSchema({
    //                 user:getUserId,
    //                 products:proId
    //             })
    //             newCart.save()
    //         }
    //     }else{
    //         res.redirect('/user-login')
    //     }

    // },





    // getproductAddToCart:async(req,res)=>{
    //     const proId=req.params.id
    //     const newUserId=req.session.user.id

    //     return new Promise(async(resolve,reject)=>{
    //         let usercart=await cart.findOne({userId:newUserId})
    //         if(usercart){

    //         }else{
    //             let cartobj={
    //                 user:newUserId,

    //             }
    //         }
    //     })



    // let usercart= await cart.findOne({userId:newUserId})
    // if(usercart){

    // }else{
    //     let cartobj={
    //         user:newUserId,
    //         products:[proId]
    //     }
    //     cart.insertOne(cartobj )
    // }





    //}




    // getUserLoginhome:(req,res)=>{
    //     console.log("userlog")
    //     res.redirect('/user-login')
    // }
}