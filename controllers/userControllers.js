const userModel = require('../models/user')
const bcrypt = require('bcrypt')
const product = require('../models/productSchema')
const { USER_COLLECTION } = require('../config/collection')
const user = require('../models/user')
const cartSchema = require('../models/cartSchema')
const { aggregate, findOne } = require('../models/user')
const otpverification = require('../utils/otp-generator')
const bannerSchema = require('../models/bannerSchema')

const wishlistSchema = require('../models/wishlistSchema')
const addressSchema=require('../models/addressSchema')
const orderSchema=require('../models/orderSchema')
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
        bannerSchema.find({ access: true }, function (err, ans) {
            product.find({ access: true }, function (err, result) {
                if (err) {
                    res.send(err);
                } else {
                    //console.log('masood')
                    //console.log(result)
                    res.render('user/user-home', { user: req.session.user, result, ans })

                }

            }).limit(8)


        });

    },


    // getUserHome: (req, res) => {
    //     //=============================================================
    //     return new Promise(async (resolve, reject) => {
    //         //  await bannerScema.find({access:true})
    //         await product.find({ access: true }).limit(8).then((result) => {
    //             resolve(result)
    //         })
    //     }).then((result) => {

    //         if (result) {
    //             // console.log(result);
    //             console.log(req.session.user)
    //             res.render('user/user-home', { user: req.session.user, result })
    //         } else {
    //             res.render("user/user-home")
    //         }

    //     })


    //     //========================================
    //     // if(loggedIn){
    //     //     let user=req.session.user
    //     //     product.find({},(err,result)=>{
    //     //         if(err){
    //     //             console.log(err)
    //     //         }else{
    //     //             res.render('user/user-home',{user,result})
    //     //         }
    //     //     })
    //     // }else{
    //     //     product.find({},(err,result)=>{
    //     //         if(err){
    //     //             console.log(err)
    //     //         }else{
    //     //             res.render('user/user-home',{user,result})
    //     //         }
    //     //     })
    //     // }
    // },

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
                // console.log('acdess')
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
        res.render('user/user-profileEdit', { user })

    },

    getUserProfilePage: (req, res) => {
        let user = req.session.user
        //console.log('get :',user.address[0]);
        res.render('user/user-profilePage', { user })
    },
    getUserEditProfile: async (req, res) => {
        let userId = req.session.user._id
        //console.log(userId + "kuta")
        let userutut = req.session.user
        //console.log(req.body)
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

        }).then((data) => {
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
            //console.log(data)
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

    otpToHome: async (req, res) => {
        console.log(req.session.otpgenerator + "hari")

        if (req.session.otpgenerator === req.body.otp) {
            console.log('akljdsaaaaaaaaaaaaaaaaajlskd;;;;;;;;;')
            console.log(req.session.otp)
            let user = await userModel.create(req.session.otp)
            console.log(user + "ksdhfasbldagalhkgfalhk")
            req.session.user = user

            req.session.otp = null
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
        product.find({ access: true }, (err, result) => {
            if (err) {
                console.log(err)
            } else {
                res.render('user/user-shop', { user, result })
            }
        })

    },



    //=================add to cart first step================
    // getUserCart: async (req, res) => {
    //     if (req.session.user) {
    //         const getUserId = req.session.user._id
    //         console.log("heyheyhey" + getUserId);
    //         proId = req.params.id
    //         console.log("madood" + proId)
    //         const userCart = await cartSchema.findOne({ user: getUserId }).lean()
    //         console.log(userCart + "mom")
    //         if (userCart) {
    //             console.log(proId);
    //             const newCart = await cartSchema.updateOne(
    //                 { user: getUserId }, //find chayyan
    //                 { $push: { products: proId } }//set chayyanulla data

    //             )

    //             res.redirect('/')
    //         } else {
    //             const newCart = new cartSchema({
    //                 user: getUserId,
    //                 products: proId
    //             })
    //             newCart.save()
    //             res.redirect('/')
    //         }
    //     } else {
    //         res.redirect('user/user-cart')
    //     }
    // },



    //================add to cart============

    getUserCart: async (req, res) => {
        let user = req.session.user
        const productId = req.params.id
        const quantity = parseInt(req.params.quantity)
        // console.log("user details")
        // console.log(user)
        // console.log("productId")
        // console.log(productId)
        // console.log("quantity")
        // console.log(quantity)

        try {
            const findProduct = await product.findById(productId)
            console.log(findProduct)
            //console.log(user)
            const userId = req.session.user._id
            const price = findProduct.price
            const name = findProduct.name
            
            // console.log(name)
            // console.log("qut")
            // console.log(findProduct.quantity)

            // console.log("abu pottan")
            // console.log(userId)

            if (findProduct.quantity >= quantity) {
                findProduct.quantity -= quantity
                const userId = req.session.user._id
                //console.log(user)
                // console.log("masood")
                // console.log(userId)
                let cart = await cartSchema.findOne({ userId })

                console.log(cart)
                if (cart) {
                    console.log("if cart")

                    //cart is exists for user
                    let itemIndex = cart.products.findIndex(p => p.productId == productId)
                    if (itemIndex > -1) {//product und
                        console.log("399")
                        let productItem = cart.products[itemIndex]
                        productItem.quantity += quantity
                    } else {
                        //product does not exist in cart, add new item 
                        console.log("404")
                        cart.products.push({ productId, quantity, name, price })
                        console.log('worked')
                    }
                    //product add chayyan
                    cart.total = cart.products.reduce((acc, curr) => {
                        console.log("409")
                        return acc + curr.quantity * curr.price
                    }, 0)
                    console.log(cart.total)
                    await cart.save()

                } else {
                    const total = quantity * price
                    cart = new cartSchema({

                        userId: userId,
                        products: [{ productId, quantity, name, price }],
                        total: total
                    })
                    console.log("masood 422")
                    await cart.save()
                }

            } else {

            }
        } catch (err) {

        }

        res.render('user/user-cart', { user })


    },

    //================show cart page===========

    getCartPage: async (req, res) => {

        let user = req.session.user
        const userId = req.session.user._id
        const viewCart = await cartSchema.findOne({ userId: userId }).populate("products.productId").exec()

        if (viewCart) {
            req.session.cartNum = viewCart.products.length
            cartNum = req.session.cartNum
            console.log('ms000000oo')
            if (viewCart.products.length) {

                console.log(viewCart)
                res.render('user/user-cart', { user, cartProduct: viewCart, cartNum })

            } else {
                res.render('user/user-cartEmpty', { user })
            }


        } else {
            res.render('user/user-cartEmpty', { user })

        }


    },

    getdeleteCartProduct: async (req, res) => {
        let prodId = req.params.id
        let UserId = req.session.user._id

        const cartProduct = await cartSchema.findOne({ userId: UserId })
        if (cartProduct) {
            let itemIndex = cartProduct.products.findIndex(c => c.productId == prodId)
            if (itemIndex > -1) {
                cartProduct.products.splice(itemIndex, 1)
                cartProduct.save()
                res.redirect('/viewUserCart')
            } else {
                res.redirect('/viewUserCart')
            }
        } else {
            res.redirect('/viewUserCart')

        }

    },

    getIngressProduct: async (req, res) => {
        console.log('11111111111111')
        let UserId = req.session.user._id
        let prodId = req.params.proId
        console.log(UserId)
        console.log(prodId)

        const incCout = await cartSchema.findOne({ userId: UserId })
        console.log(incCout + 'ray')
        let itemIndex = incCout.products.findIndex(c => c.productId == prodId)

        let productItem = incCout.products[itemIndex]
        productItem.quantity++;

        incCout.total = incCout.total + productItem.price

        incCout.save()
        res.redirect('/viewUserCart')
    },

    getdegreasProduct: async (req, res) => {
        let UserId = req.session.user._id
        let prodId = req.params.proId

        console.log(UserId)
        console.log(prodId)

        const decCout = await cartSchema.findOne({ userId: UserId })

        let itemIndex = decCout.products.findIndex(c => c.productId == prodId)

        let productItem = decCout.products[itemIndex]
        productItem.quantity--;
        console.log(decCout.total + "priceeeeeeeeeeeeeeeeeeeeeee");
        decCout.total = decCout.total - productItem.price

        decCout.save()

        res.redirect('/viewUserCart')
    },


    getUserWishlist: async (req, res) => {
        let user = req.session.user
        const productId = req.params.proId

        try {
            let userId = req.session.user._id
            const wish = await wishlistSchema.findOne({ userId: userId })

            if (wish) {
                let itemIndex = wish.myWish.findIndex(c => c.productId == productId)
                if (itemIndex > -1) {
                    console.log('first if')
                    wish.myWish.splice(itemIndex, 1)
                    await wish.save()
                } else {
                    console.log('else')
                    wish.myWish.push({ productId })
                }
                await wish.save()
            } else {
                console.log('masood')
                let list = new wishlistSchema({
                    userId: userId,
                    myWish: [{ productId }],
                })
                await list.save()
            }
        } catch {
        }
        res.render('user/user-wishlist', { user })
    },


    getShowWishlist: async (req, res) => {
        let user = req.session.user
        const userId = req.session.user._id
        const wishli = await wishlistSchema.findOne({ userId: userId }).populate("myWish.productId").exec()
        console.log(wishli)

        if (wishli) {
            req.session.wishNum = wishli.myWish.length
            if (wishli.myWish.length) {
                res.render('user/user-wishlist', { user, wishlist: wishli })

            } else {
                res.render('user/user-emptyWish', { user })
            }
        } else {
            res.render('user/user-emptyWish', { user })

        }

    },


    getdeletewishlistProducts: async (req, res) => {
        let prodId = req.params.id
        let userId = req.session.user._id
        const deleteWishlist = await wishlistSchema.findOne({ userId: userId })
        if (deleteWishlist) {
            let itemIndex = deleteWishlist.myWish.findIndex(c => c.productId == prodId)
            if (itemIndex > -1) {
                deleteWishlist.myWish.splice(itemIndex, 1)
                deleteWishlist.save()
                res.redirect('/user-showWishlist')
            } else {
                res.redirect('/user-showWishlist')
            }
        } else {
            res.redirect('/user-showWishlist')
        }
    },

    getAddAddresstoPay:async(req,res)=>{
        let user=req.session.user
        const userId=req.session.user._id

        const prod=await cartSchema.findOne({userId:userId})
        console.log(prod)
        res.render('user/user-checkout',{user,prod})
    },

    getpaymentAddress:async(req,res)=>{
        console.log(req.body)
        let userId= req.session.user._id
        console.log(userId)
        const findAddress=await addressSchema.findOne({userId:userId})

        if(findAddress==null){
            //new order address add
            const newAddress=new addressSchema({
                userId,
                address:[{
                    name:req.body.name,
                    phoneNo:req.body.phoneNo,
                    city:req.body.city,
                    state:req.body.state,
                    country:req.body.country,
                    zip:req.body.zip,
                    payment:req.body.payment
                }]
            })
            await newAddress.save()
            //res.render('user/user-orderConform')
        }else{
            //address veendum add chayyan
            findAddress.address.push({
                name:req.body.name,
                phoneNo:req.body.phoneNo,
                city:req.body.city,
                state:req.body.state,
                country:req.body.country,
                zip:req.body.zip,
                payment:req.body.payment
            })
            await findAddress.save()
            //res.redirect('user/userConform')
        }
        //adding order schema
        let cart= await cartSchema.findOne({userId:userId})
        console.log(cart)
        let newdate = new Date().toJSON().slice(0, 10);
    const newOder = new orderSchema({
        userId,
        deliveryAddress:[{
            name:req.body.name,
            phoneNo:req.body.phoneNo,
            city:req.body.city,
            state:req.body.state,
            country:req.body.country,
            zip:req.body.zip,
            
        }],
        paymentType:req.body.payment,
        date:newdate,
        products:cart.products,
        total:cart.total, 

    })
    await cart.remove()
    await newOder.save()
    res.render('user/user-orderConform',{newOder})
        
    },

    
    getUserOrder:async(req,res)=>{
        let userId=req.session.user._id
        let user=req.session.user
        const userOrder=await orderSchema.find({userId:userId}).populate("products.productId").exec()
        console.log(userOrder[0].products[0].productId)
    
        res.render('user/user-orderDetails',{userOrder,user})
    },

    getOrderCancel:async(req,res)=>{
        let orderId=req.params.id
        const cancelOrder=await orderSchema.findOne({_id:orderId})
        cancelOrder.status="canceled"
        await cancelOrder.save()
        res.redirect('/user-order')
    }






    //============a code=========

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






}