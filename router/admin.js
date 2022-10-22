var express = require('express');
const adminControllers=require('../controllers/adminControllers');
const admin = require('../models/admin');
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

//admin edit product
router.get('/edit-product/:id',adminControllers.getAdminEditProduct)

//admin delect product by admin
router.get('/delete-Product/:id',adminControllers.getAdminDeleteProduct)

//admin undelect product by admin
router.get('/undelete-Product/:id',adminControllers.getAdminUndelectProduct)

//admin product updat post methord
router.post('/update-product/:id',adminControllers.getAdminProductUpdate)

//admin user block
router.get('/block-user/:id',adminControllers.getAdminBlockUser)

//admin user unblock
router.get('/unblock-user/:id',adminControllers.getAdminUnblockAllUser)

//admin render category page
router.get('/categoryPage',adminControllers.getAdminAddCategoryPage)

// admin add catecory post methord 
router.post('/add-category',adminControllers.getAdminAddCategory)

//admin delete catergory
router.get('/delete-category/:id',adminControllers.getAdminDeleteCategory)

//admin view product by catecory
router.get('/view-productCategory/:id',adminControllers.getAdminViewCategorey)



module.exports = router;
