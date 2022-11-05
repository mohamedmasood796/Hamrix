var express = require('express');
const adminControllers=require('../controllers/adminControllers');
const admin = require('../models/admin');
var router = express.Router();
// const multer= require('multer') 
// const store = multer({ dest: '/product-images' })
const {store} = require('./../middleware/multer')

const varifySession = require("../middleware/session");



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

//admin delete product by admin
router.get('/delete-Product/:id',adminControllers.getAdminDeleteProduct)

//admin undelect product by admin
router.get('/undelete-Product/:id',adminControllers.getAdminUndelectProduct)

//admin product updat post methord
router.post('/update-product/:id',store.array("image",3),adminControllers.getAdminProductUpdate)

//admin user block
router.get('/block-user/:id',adminControllers.getAdminBlockUser)

//admin user unblock
router.get('/unblock-user/:id',adminControllers.getAdminUnblockAllUser)

//admin render category page
router.get('/categoryPage',adminControllers.getAdminAddCategoryPage)

// admin add catecory post methord 
router.post('/add-category',adminControllers.getAdminAddCategory)

//admin delete catergory
router.post('/delete-category/:name',adminControllers.getAdminDeleteCategory)

//admin view product by catecory
router.get('/view-productCategory/:id',adminControllers.getAdminViewCategorey)

//admin banner managment page get
router.get('/banneraddpage',adminControllers.getAdminBanner)

//admin banner page post
router.post('/addbanner',store.array("image",3),adminControllers.getAdminBannerPost)

//admin can block banner
router.get('/block-banner/:id',adminControllers.getBannerBlock)

//admin can unblock banner
router.get('/unblock-banner/:id',adminControllers.getAdminUnblockBanner)

//admin order managment 
router.get('/orderManagment',adminControllers.getOrderManagment)

//admin user order in one page
router.get('/veiwOneProduct/:id',adminControllers.getveiwOneProduct)

//admin change delivery status
router.post('/chargeDeliveryStatus/:id',varifySession.verifyLogin,adminControllers.getchargeDeliveryStatus)





module.exports = router;
