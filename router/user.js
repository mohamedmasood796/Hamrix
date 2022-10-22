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
router.post('/user-signup',userControllers.getUserSignupPost)

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





//user cart page shew 
//router.get('/user-cart',userControllers.getUserCart)

//product add to cart
//router.get('/add-to-cart/:id',userControllers.getproductAddToCart)



module.exports=router