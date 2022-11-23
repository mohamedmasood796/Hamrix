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
const addressSchema = require('../models/addressSchema')
const orderSchema = require('../models/orderSchema')
const verifyLogin = require('../middleware/session')
const Razorpay = require('razorpay')
const couponSchema = require('../models/couponSchema')
const categorySchema = require('../models/categorySchema')

let loggedIn;

const instance = new Razorpay({
    key_id: process.env.key_id,
    key_secret: process.env.key_secret
})
const otpKeys = require("../utils/otp-keys");
const accountSid = otpKeys.accountSid;
const authToken = otpKeys.authToken;
const serviseId = otpKeys.servieId;
const client = require('twilio')(accountSid, authToken)


let loginErr;

module.exports = {

    getUserHome: (req, res, next) => {
        try {
            if (req.session.userloggedIn) {
                const userId = req.session.user._id
                console.log(userId + "abuq")
                bannerSchema.find({ access: true }, function (err, ans) {
                    product.find({ access: true }, function (err, result) {

                        cartSchema.find({ userId: userId }, function (err, cartCoud) {
                            wishlistSchema.find({ userId: userId }, function (err, wishcount) {
                                categorySchema.find({}, function (err, category) {
                                    console.log("hiba")
                                    console.log(category)

                                    if (err) {
                                        res.send(err);
                                    } else {
                                        if (cartCoud[0]) {
                                            count = cartCoud[0].products.length
                                            wcount = wishcount[0].myWish.length
                                        } else {
                                            count = 0
                                            wcount = 0
                                        }
                                        

                                        //console.log('masood')
                                        //console.log(result)

                                        res.render('user/user-home', { user: req.session.user, result, ans, count, wcount, category })
                                    }
                                })
                            })
                        })
                    }).limit(8)
                });
            } else {
                bannerSchema.find({ access: true }, function (err, ans) {
                    product.find({ access: true }, function (err, result) {
                        categorySchema.find({}, function (err, category) {
                            if (err) {
                                console.log(err);
                            }
                            if (result) {
                                res.render('user/user-home', { user: req.session.user, result, ans, count: 0, wcount: 0, category })
                            }

                        })


                    }).limit(8)
                });
            }

        } catch (error) {
            next(err)
        }



    },


    getUserLogin: (req, res, next) => {
        try {
            if (req.session.userloggedIn) {
                let user = req.session.user
                res.redirect('/')
            } else {
                res.render('user/user-login', { loginErr })
                loginErr = null
            }
        } catch (error) {
            next(err)
        }
    },

    getUserSignup: (req, res, next) => {
        try {
            if (req.session.userloggedIn) {
                res.redirect('/')
            } else {
                res.render('user/user-signup')

            }

        } catch (error) {
            next(err)
        }

    },
    //--------------------user login post --------------------

    getUserLoginPost: async (req, res, next) => {

        try {
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

        } catch (error) {
            next(err)
        }

    },


    //--------------------------secssion distroy

    getUserLogout: (req, res, next) => {
        try {
            req.session.destroy()
            res.redirect('/')

        } catch (error) {
            next(err)
        }

    },

    getUserProfileshow: (req, res, next) => {
        try {
            let user = req.session.user
            res.render('user/user-profileEdit', { user })

        } catch (error) {
            next(err)
        }


    },

    getUserProfilePage: (req, res, next) => {
        try {
            let user = req.session.user
            //console.log('get :',user.address[0]);
            res.render('user/user-profilePage', { user })

        } catch (error) {
            next(err)
        }

    },
    getUserEditProfile: async (req, res, next) => {

        try {
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

        } catch (error) {
            next(err)
        }
    },

    getOnePageProduct: async (req, res, next) => {
        console.log("hhhhhhhhhhhh");
        try {
            let user = req.session.user
            const proId = req.params.id
            console.log(user)
            console.log(proId)
            let products = await product.findById(proId)
            console.log(products)
            res.render('user/user-productOnePage', { products, user })
        } catch (error) {
            next(err)
        }

    },


    //user sigin up
    getUserSiginupPage: (req, res) => {
        try {
            const nna = userModel.find({ userEmail: req.body.email }, async (err, data) => {

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
                        // req.session.otpgenerator = otpverification.otpgeneratorto();//otp undakkan ayakkulla
                        // console.log(req.session.otpgenerator)

                        //message sending
                        otpverification.otpsender(req.body.phone)//opt message phonekk varan
                            .then(() => {
                                res.render('/user-otp')
                            })


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

        } catch (error) {
            next(err)
        }


    },

    //==================otp page home

    otpToHome: async (req, res) => {
        try {
            console.log(req.session.otp.phone);
            client.verify.v2.services(serviseId)
                .verificationChecks
                .create({ to: `+91${req.session.otp.phone}`, code: req.body.otp })
                .then(verification_check => {
                    console.log(verification_check.status)
                    if (verification_check.status == 'approved') {
                        let user = userModel.create(req.session.otp)
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
                });
        } catch (error) {
            next(err)
        }


    },

    getUserAllProduct: (req, res) => {

        try {
            let user = req.session.user
            product.find({ access: true }, (err, result) => {
                if (err) {
                    console.log(err)
                } else {
                    res.render('user/user-shop', { user, result })
                }
            })

        } catch (error) {
            next(err)
        }


    },

    //================add to cart============

    getUserCart: async (req, res, next) => {

        let user = req.session.user
        const productId = req.params.id
        const quantity = parseInt(req.params.quantity)

        try {
            const findProduct = await product.findById(productId)
            console.log(findProduct)
            //console.log(user)
            const userId = req.session.user._id
            const price = findProduct.price
            const name = findProduct.name

            if (findProduct.quantity >= quantity) {
                findProduct.quantity -= quantity
                const userId = req.session.user._id

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
                    res.json({ status: true })
                } else {
                    const total = quantity * price
                    cart = new cartSchema({

                        userId: userId,
                        products: [{ productId, quantity, name, price }],
                        total: total
                    })
                    console.log("masood 422")
                    await cart.save()
                    res.json({ status: true })

                }

            } else {

            }
        } catch (error) {
            next(err)

        }

        res.render('user/user-cart', { user })


    },

    //================show cart page===========

    getCartPage: async (req, res, next) => {

        try {
            let user = req.session.user
            const userId = req.session.user._id
            const viewCart = await cartSchema.findOne({ userId: userId }).populate("products.productId").exec()

            if (viewCart) {
                req.session.cartNum = viewCart.products.length
                cartNum = req.session.cartNum

                if (viewCart.products.length) {
                    res.render('user/user-cart', { user, cartProduct: viewCart, cartNum })

                } else {
                    res.render('user/user-cartEmpty', { user })
                }


            } else {
                res.render('user/user-cartEmpty', { user })

            }

        } catch (error) {
            next(err)
        }

    },

    getdeleteCartProduct: async (req, res, next) => {

        try {
            let prodId = req.params.id
            let UserId = req.session.user._id

            const cartProduct = await cartSchema.findOne({ userId: UserId })
            console.log("cartproduct")
            console.log(cartProduct)
            console.log("cartProductend")
            if (cartProduct) {
                let itemIndex = cartProduct.products.findIndex(c => c.productId == prodId)
                if (itemIndex > -1) {
                    //cart nn product delect chayithal total reduce chayan
                    let reducePrice = cartProduct.products[itemIndex].quantity * cartProduct.products[itemIndex].price
                    cartProduct.total = cartProduct.total - reducePrice

                    cartProduct.products.splice(itemIndex, 1)
                    cartProduct.save()
                    res.redirect('/viewUserCart')
                } else {
                    res.redirect('/viewUserCart')
                }
            } else {
                res.redirect('/viewUserCart')

            }

        } catch (error) {
            next(err)
        }


    },

    getIngressProduct: async (req, res, next) => {
        try {
            let UserId = req.session.user._id
            let prodId = req.params.proId

            const incCout = await cartSchema.findOne({ userId: UserId })

            let itemIndex = incCout.products.findIndex(c => c.productId == prodId)

            let productItem = incCout.products[itemIndex]
            productItem.quantity++;

            incCout.total = incCout.total + productItem.price

            incCout.save()
            res.redirect('/viewUserCart')

        } catch (error) {
            next(err)
        }

    },

    getdegreasProduct: async (req, res, next) => {
        try {
            let UserId = req.session.user._id
            let prodId = req.params.proId
            const decCout = await cartSchema.findOne({ userId: UserId })
            let itemIndex = decCout.products.findIndex(c => c.productId == prodId)
            let productItem = decCout.products[itemIndex]
            productItem.quantity--;
            decCout.total = decCout.total - productItem.price
            decCout.save()
            res.redirect('/viewUserCart')

        } catch (error) {
            next(err)
        }

    },


    getUserWishlist: async (req, res, next) => {
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
        } catch (error) {
            next(err)
        }
        res.render('user/user-wishlist', { user })
    },


    getShowWishlist: async (req, res, next) => {
        try {
            let user = req.session.user
            const userId = req.session.user._id
            const wishli = await wishlistSchema.findOne({ userId: userId }).populate("myWish.productId").exec()


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

        } catch (error) {
            next(err)
        }


    },


    getdeletewishlistProducts: async (req, res, next) => {
        try {
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

        } catch (error) {
            next(err)
        }

    },

    getAddAddresstoPay: async (req, res, next) => {
        try {
            let user = req.session.user
            const userId = req.session.user._id

            const coupon = await couponSchema.findOne({ isActive: true })
            const prod = await cartSchema.findOne({ userId: userId })
            if (prod != null) {
                let cartProduct = prod.products
                const findAddress = await addressSchema.find({ userId: userId })
                console.log("slice address")
                console.log(findAddress)
                if (findAddress != null) {
                    console.log(findAddress)
                    let address = findAddress[0].address.slice(0, 4)
                    console.log("2 if cheq")
                    console.log(address)
                    res.render('user/user-checkout', { user, cartProduct, prod, address, coupon })
                } else {
                    let address = null
                    res.render('user/user-checkout', { user, cartProduct, prod, address, coupon })

                }
            } else {
                res.redirect('/')
            }

        } catch (error) {
            next()
        }



    },

    getDeleteAddress: async (req, res, next) => {
        try {
            const userId = req.session.user._id

            const addressIndex = req.params.addressIndex

            const adrs = await addressSchema.findOne({ userId: userId })
            adrs.address.splice(addressIndex, 1)
            await adrs.save()
            res.json({ status: true })

        } catch (error) {
            next(err)
        }
    },

    getpaymentAddress: async (req, res, next) => {
        try {
            let userId = req.session.user._id

            const findAddress = await addressSchema.findOne({ userId: userId }).limit(4)

            if (findAddress == null) {
                //new order address add
                const newAddress = new addressSchema({
                    userId,
                    address: [{
                        name: req.body.name,
                        phoneNo: req.body.phoneNo,
                        city: req.body.city,
                        state: req.body.state,
                        country: req.body.country,
                        zip: req.body.zip,
                        payment: req.body.payment
                    }]
                })
                await newAddress.save()
                //res.render('user/user-orderConform')
            } else {
                //address veendum add chayyan
                findAddress.address.push({
                    name: req.body.name,
                    phoneNo: req.body.phoneNo,
                    city: req.body.city,
                    state: req.body.state,
                    country: req.body.country,
                    zip: req.body.zip,
                    payment: req.body.payment
                })
                await findAddress.save()
                //res.redirect('user/userConform')
            }
            //adding order schema
            let cart = await cartSchema.findOne({ userId: userId })
            console.log(cart)
            let newdate = new Date().toJSON().slice(0, 10);
            const newOder = new orderSchema({
                userId,
                deliveryAddress: [{
                    name: req.body.name,
                    phoneNo: req.body.phoneNo,
                    city: req.body.city,
                    state: req.body.state,
                    country: req.body.country,
                    zip: req.body.zip,

                }],
                paymentType: req.body.payment,
                date: newdate,
                products: cart.products,
                total: cart.total,

            })
            await cart.remove()
            await newOder.save()
            req.session.orderId = newOder._id

            if (req.body.payment === "cod") {

                res.json({ codStatus: true })
            } else {


                var options = {
                    amount: newOder.total * 100,  // amount in the smallest currency unit
                    currency: "INR",
                    receipt: "" + newOder._id
                };
                instance.orders.create(options, function (err, order) {
                    console.log('maodod')
                    // console.log(order);
                    res.json(order)
                });
            }

        } catch (error) {
            next(err)
        }
    },
    getSuccessPage: async (req, res, next) => {
        try {
            orderId = req.session.orderId
            console.log("hw00000000000000000000000000000000")
            const newOder = await orderSchema.findOne({ _id: orderId })
            res.render('user/user-orderConform', { newOder })

        } catch (error) {
            next(err)
        }

    },

    getverifyPayment: async (req, res, next) => {
        try {
            let details = req.body
            const crypto = require('crypto')
            let hmac = crypto.createHmac('sha256', 'oYvKdh1HCvzITC5kKwUQb8Lo');
            console.log('start form here')
            console.log(hmac)
            hmac.update(details['payment[razorpay_order_id]'] + '|' + details['payment[razorpay_payment_id]']);

            hmac = hmac.digest('hex')
            console.log("ooooooooooooops");
            console.log(hmac == details['payment[razorpay_signature]']);
            if (hmac == details['payment[razorpay_signature]']) {
                console.log('payment seccess')
                orderId = req.session.orderId
                await orderSchema.findByIdAndUpdate(orderId, { status: 'placed' })
                res.json({status:true})
                // const changeStatus = await orderSchema.findOne({ _id: orderId })
                // cancelOrder.status = "cancelled"
                // await cancelOrder.save()
            } else {

                console.log('payment fails')
            }

            console.log(req.body)

        } catch (error) {
            next(err)
        }

    },


    getUserOrder: async (req, res, next) => {
        try {
            console.log('1111111111111111111')
            let userId = req.session.user._id
            console.log(userId)
            let user = req.session.user
            console.log(user)
            const userOrder = await orderSchema.find({ userId: userId }).sort({ date: -1 }).populate("products.productId").exec()
            console.log(userOrder)

            if(userOrder.length === 0){
                res.render('user/user-orderEmpty',{user})
                
            }else{
                res.render('user/user-orderDetails',{user,userOrder})
            }
           
        } catch (error) {
            next(err)
        }

    },

    getOrderCancel: async (req, res, next) => {
        try {
            let orderId = req.params.id
            const cancelOrder = await orderSchema.findOne({ _id: orderId })
            cancelOrder.status = "cancelled"
            await cancelOrder.save()
            res.redirect('/user-order')

        } catch (error) {
            next(err)
        }

    },

    getcheckCoupon: async (req, res, next) => {
        try {
            let code = req.params.couponValue
            let userId = req.session.user._id

            let coupons = await couponSchema.findOne({ couponCode: code }).lean()

            if (coupons != null) {
                let today = new Date();
                console.log(coupons.expDate)
                console.log(today)
                if (coupons.expDate > today) {
                    let itemIndex = coupons.usedUsers.findIndex(p => p.userId == userId)
                    console.log(itemIndex)
                    if (itemIndex == -1) {
                        console.log('mine')
                        let userCart = await cartSchema.findOne({ userId: userId })

                        let discount = coupons.discount

                        let discountPrice = ((userCart.total / 100) * discount)
                        discountPrice = Math.round(discountPrice)

                        totalamount = (userCart.total) - (discountPrice)
                        userCart.total = totalamount

                        userCart.save()

                        await couponSchema.findOneAndUpdate({ couponCode: code }, { $push: { usedUsers: { userId } } })
                        res.json({ status: true, discountPrice, totalamount })
                    } else {
                        res.json({ used: true })
                        console.log("used")
                    }
                } else {
                    console.log("date kayijuno")
                    res.json({ expired: true })

                }

            } else {
                console.log("coupon ella")
                res.json({ noMatch: true })
            }

        } catch (error) {
            next(err)
        }
    },





}