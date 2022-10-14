var express = require('express');
const adminControllers=require('../controllers/adminControllers')
var router = express.Router();


//admin home render
router.get('/', adminControllers.getAdminHome)

//admin login render
router.get('/admin-login',adminControllers.getAdminLogin)

//admin login post redirect
router.post('/admin-login',adminControllers.getAdminLoginPost)





module.exports = router;
