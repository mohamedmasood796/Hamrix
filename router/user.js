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


module.exports=router