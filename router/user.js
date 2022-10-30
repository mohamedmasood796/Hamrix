const express =require('express');
const userControllers=require('../controllers/userControllers');
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
router.get('/userCart/:id/:quantity',userControllers.getUserCart)

//show cart page
router.get('/viewUserCart',userControllers.getCartPage)

//add to in product wishlist
router.get('/user-wishlist/:proId',userControllers.getUserWishlist)

//show wishlist
router.get('/user-showWishlist',userControllers.getShowWishlist)






//product add to cart
//router.get('/add-to-cart/:id',userControllers.getproductAddToCart)

//user cart page get
// router.get('/view-cartPage',userControllers.getCartPage)



module.exports=router