var express = require('express');
const adminControllers=require('../controllers/adminControllers');
const admin = require('../models/admin');
var router = express.Router();
// const multer= require('multer') 
// const store = multer({ dest: '/product-images' })
const {store} = require('./../middleware/multer')

const varifyadmin = require("../middleware/session");



//admin home render
router.get('/', varifyadmin.verifyLogin,adminControllers.getAdminHome)

//admin login render
router.get('/admin-login',varifyadmin.verifyLogin,adminControllers.getAdminLogin)

//admin login post redirect
router.post('/admin-login',varifyadmin.verifyLogin,adminControllers.getAdminLoginPost)

//admin all product 
router.get('/all-product',varifyadmin.verifyLogin,adminControllers.getAdminAllProduct)

//admin add product
router.get('/add-product',varifyadmin.verifyLogin,adminControllers.getAdminAddProduct)

//admin add product post
router.post('/add-product',varifyadmin.verifyLogin,store.array("image",3),adminControllers.getAdminAddProductPost)

//admin show all user
router.get('/all-user',varifyadmin.verifyLogin,adminControllers.getAdminAllUser)

//admin edit product
router.get('/edit-product/:id',varifyadmin.verifyLogin,adminControllers.getAdminEditProduct)

//admin delete product by admin
router.get('/delete-Product/:id',varifyadmin.verifyLogin,adminControllers.getAdminDeleteProduct)

//admin undelect product by admin
router.get('/undelete-Product/:id',varifyadmin.verifyLogin,adminControllers.getAdminUndelectProduct)

//admin product updat post methord
router.post('/update-product/:id',store.array("image",3),varifyadmin.verifyLogin,adminControllers.getAdminProductUpdate)

//admin user block
router.get('/block-user/:id',varifyadmin.verifyLogin,adminControllers.getAdminBlockUser)

//admin user unblock
router.get('/unblock-user/:id',varifyadmin.verifyLogin,adminControllers.getAdminUnblockAllUser)

//admin render category page
router.get('/categoryPage',varifyadmin.verifyLogin,adminControllers.getAdminAddCategoryPage)

// admin add catecory post methord 
router.post('/add-category',varifyadmin.verifyLogin,adminControllers.getAdminAddCategory)

//admin delete catergory
router.post('/delete-category/:name',varifyadmin.verifyLogin,adminControllers.getAdminDeleteCategory)

//admin view product by catecory
router.get('/view-productCategory/:id',varifyadmin.verifyLogin,adminControllers.getAdminViewCategorey)

//admin banner managment page get
router.get('/banneraddpage',varifyadmin.verifyLogin,adminControllers.getAdminBanner)

//admin banner page post
router.post('/addbanner',varifyadmin.verifyLogin,store.array("image",3),adminControllers.getAdminBannerPost)

//admin can block banner
router.get('/block-banner/:id',varifyadmin.verifyLogin,adminControllers.getBannerBlock)

//admin can unblock banner
router.get('/unblock-banner/:id',varifyadmin.verifyLogin,adminControllers.getAdminUnblockBanner)

//admin order managment 
router.get('/orderManagment',varifyadmin.verifyLogin,adminControllers.getOrderManagment)

//admin user order in one page
router.get('/veiwOneProduct/:id',varifyadmin.verifyLogin,adminControllers.getveiwOneProduct)

//admin change delivery status
router.post('/chargeDeliveryStatus/:id',varifyadmin.verifyLogin,adminControllers.getchargeDeliveryStatus)

//admin coupen mangement
router.get('/adminCoupon',varifyadmin.verifyLogin,adminControllers.getaddCouponPage)

//admin add a coupon 
router.post('/addCoupon',varifyadmin.verifyLogin,adminControllers.getAddCoupon)

//admin show sales report
router.get('/salesReport',varifyadmin.verifyLogin,adminControllers.getsalesReport)

//admin delete coupon 
router.get('/delete-coupon/:id',varifyadmin.verifyLogin,adminControllers.getdelectCoupon)





//err page
// router.get('/err',adminControllers.errpage)
/* For Admin Error Page */
router.use(function (req, res, next) {
    next(createError(404));
  });
  
  router.use(function (err, req, res, next) {
    res.status(err.status || 500);
    console.log("kokok");
    res.render('admin/admin-404');
  });




module.exports = router;
