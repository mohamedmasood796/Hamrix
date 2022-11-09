const express =require('express');
const userControllers=require('../controllers/userControllers');
const user = require('../models/user');
const varifySession=require('../middleware/session')
const router=express.Router();

//ger user home page
router.get('/',userControllers.getUserHome)

//get user login page
router.get('/user-login',userControllers.getUserLogin)

//get user signup page
router.get('/user-signup',userControllers.getUserSignup)

//user login page post
router.post('/user-login',userControllers.getUserLoginPost)

//get user signup post
//router.post('/user-signup',userControllers.getUserSignupPost)

//get user session distroy 
router.get('/user-logout',userControllers.getUserLogout)

//user home login button kittitilla
//router.get('/uesr-login',userControllers.getUserLoginhome)

//user home profile
router.get('/user-profileEdit',userControllers.getUserProfileshow)

//to show user profile
router.get('/user-profilePage',userControllers.getUserProfilePage)

//user post methord in edit profile
router.post('/user/user-profile',userControllers.getUserEditProfile)

//to show product one page delect
router.get('/show-onePageProduct/:id',userControllers.getOnePageProduct)

//to show otp page and post of signup
router.post('/user-otp',userControllers.getUserSiginupPage)

//user otp page to home
router.post('/to-home',userControllers.otpToHome)

//user show all product 
router.get('/user-all-product',userControllers.getUserAllProduct)

//user cart page shew 
router.get('/userCart/:id/:quantity',varifySession.verifyLogin,userControllers.getUserCart)

//show cart page
router.get('/viewUserCart',varifySession.verifyLogin,userControllers.getCartPage)

//delect product in cart page
router.get('/deleteCartProduct/:id',varifySession.verifyLogin,userControllers.getdeleteCartProduct)

//ingreas product quandity
router.post('/posProduct/:proId',varifySession.verifyLogin,userControllers.getIngressProduct)

//degremont product quandity
router.post('/negProduct/:proId',varifySession.verifyLogin,userControllers.getdegreasProduct)




//add to in product wishlist
router.get('/user-wishlist/:proId',varifySession.verifyLogin,userControllers.getUserWishlist)

//show wishlist
router.get('/user-showWishlist',varifySession.verifyLogin,userControllers.getShowWishlist)

//delect product form cart page
router.get('/deleteWishlist/:id',varifySession.verifyLogin,userControllers.getdeletewishlistProducts)

//chek out page addd address
router.get('/checkout',varifySession.verifyLogin,userControllers.getAddAddresstoPay)

//delect address
router.post('/deleteAddress/:addressIndex',varifySession.verifyLogin,userControllers.getDeleteAddress)




//payment address post 
router.post('/cartpayment',varifySession.verifyLogin,userControllers.getpaymentAddress)

//user order details
router.get('/user-order',varifySession.verifyLogin,userControllers.getUserOrder)

//user order cancel 
router.get('/orderCancel/:id',varifySession.verifyLogin,userControllers.getOrderCancel)

//order conform page
router.get('/order-confirmed',varifySession.verifyLogin,userControllers.getSuccessPage)

//order verify payment 
router.post('/verify-payment',varifySession.verifyLogin,userControllers.getverifyPayment)

//user use coupon
router.post('/checkCoupon/:couponValue',userControllers.getcheckCoupon)



//product add to cart
//router.get('/add-to-cart/:id',userControllers.getproductAddToCart)

//user cart page get
// router.get('/view-cartPage',userControllers.getCartPage)



module.exports=router