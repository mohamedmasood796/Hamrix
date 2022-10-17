var express = require('express');
const adminControllers=require('../controllers/adminControllers')
var router = express.Router();
// const multer= require('multer') 
// const store = multer({ dest: '/product-images' })
const {store} = require('./../middleware/multer')

//admin home render
router.get('/', adminControllers.getAdminHome)

//admin login render
router.get('/admin-login',adminControllers.getAdminLogin)

//admin login post redirect
router.post('/admin-login',adminControllers.getAdminLoginPost)

//admin all product 
router.get('/all-product',adminControllers.getAdminAllProduct)

//admin add product
router.get('/add-product',adminControllers.getAdminAddProduct)

//admin add product post
router.post('/add-product',store.array("image",3),adminControllers.getAdminAddProductPost)

//admin show all user
router.get('/all-user',adminControllers.getAdminAllUser)



module.exports = router;
