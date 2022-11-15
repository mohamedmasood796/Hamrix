const admin = require('../models/admin')
const product = require('../models/productSchema')
const User = require("../models/user")
const category = require('../models/categorySchema')
const bcrypt = require('bcrypt')
const cartSchema = require('../models/cartSchema')
const orderSchema = require('../models/orderSchema')
const collection = require('../config/collection')
const user = require('../models/user')
const { render } = require('ejs')
const { findById } = require('../models/admin')
const bannerSchema = require("../models/bannerSchema")
const couponSchema = require('../models/couponSchema')
const { BulkCountryUpdatePage } = require('twilio/lib/rest/voice/v1/dialingPermissions/bulkCountryUpdate')
const { find } = require('../models/user')
const verifyadmin=require('../middleware/adminSession')


let categoryErr;
let adminloginErr;



module.exports = {


    getAdminHome: async (req, res, next) => {
        try {
            if (req.session.adminloggedIn) {
                let admin = req.session.user
                let userCount = await user.find({}).count()
                let productCount = await product.find({}).count()
                let sales = await orderSchema.find({})
                let totalorder = sales.length
                totalsales = 0
                for (var i = 0; i < totalorder; i++) {
                    totalsales = totalsales + sales[i].total
                }

                console.log("masood")
                const cancelOrder=await orderSchema.find({status:"cancelled"}).count()
                const activeOrder = totalorder-cancelOrder
                console.log(activeOrder)

                const pending=await orderSchema.find({status:"pending"}).count()
                const placed=await orderSchema.find({status:"placed"}).count()
                const delivered=await orderSchema.find({status:"delivered"}).count()
                const shipped= await orderSchema.find({status:"shipped"}).count()


                const totalSales = await orderSchema.aggregate([

                    // First Stage
                    {
                        $match: { "date": { $ne: null } }
                    },
                    // Second Stage
                    {
                        $group: {
                            _id:   "$date"  ,
                            sales: { $sum: "$total" },
                        }
                    },
                    // Third Stage
                    {
                        $sort: { _id: -1 }
                    },
                    {
                        $limit: 7
                    }
                ])
                
                console.log(totalSales)
                const salesLabels=totalSales.map(item =>{
                    return item._id
                })
                const salesData= totalSales.map(item =>{
                    return item.sales.toFixed(2)
                })
                console.log("hari")
                console.log(salesLabels)
                console.log(salesData)

                res.render('admin/admin-home', {activeOrder,pending,placed,delivered,shipped, admin, userCount, productCount, sales, totalsales, totalorder ,cancelOrder,salesLabels,salesData})
            } else {
                res.render('admin/admin-login', { adminloginErr })
                adminloginErr = null
            }

        } catch (error) {
            next(err)
        }
    },

    getAdminLogin: (req, res,next) => {
        try {
            res.render('admin/admin-login')

        } catch (error) {
            next(err)
        }


    },

    //-----------------------------------admin post login---------------------

    getAdminLoginPost: (req, res, next) => {
        try {
            const email = req.body.email
            const password = req.body.password
            admin.findOne({ adminEmail: email }, (err, data) => {

                if (data) {
                    bcrypt.compare(password, data.password).then((datas) => {
                        if (data) {
                            console.log('bcript')
                            console.log(data.password)
                            req.session.adminloggedIn = true
                            req.session.user = data
                            res.redirect('/admin/')
                        } else {
                            req.session.loginErr = true
                            console.log("password incorrect")
                            adminloginErr = "invalid password"
                            res.redirect('/admin/')
                        }
                    })
                } else {
                    console.log("data not found")
                    adminloginErr = "invalid email"
                    res.redirect('/admin/')
                }
            })

        } catch (error) {
            next(err)
        }



    },

    //add product by admin
    getAdminAllProduct: (req, res, next) => {
    
        try {
            product.find({}, function (err, result) {

                if (err) {
                    res.send(err);
                } else {

                    res.render('admin/admin-allproduct', { result })

                }
            });

        } catch (error) {
            next(err)
        }


    },
    //add product by admin
    getAdminAddProduct: (req, res, next) => {
        try {
            category.find({}, (err, data) => {
                if (err) {
                    console.log(err)
                } else {
                    res.render('admin/admin-addproduct', { data })
                }
            })

        } catch (error) {
            next(err)
        }


    },

    //add product post methord
    getAdminAddProductPost: (req, res, next) => {
        try {
            console.log(req.body)
            const name = req.body.name
            const description = req.body.description
            const price = req.body.price
            const quantity = req.body.quantity
            const category = req.body.category
            const image = req.body.image

            let files = req.files
            if (files) {
                let Images = []
                for (i = 0; i < req.files.length; i++) {
                    Images[i] = files[i].filename
                }
                req.body.image = Images
                const addProduct = new product({
                    name: name,
                    price: price,
                    description: description,
                    category: category,
                    quantity: quantity,
                    image: Images,
                    access: true
                })

                console.log(addProduct)
                addProduct.save()
                    .then((result) => {
                        res.redirect('/admin/add-product')
                    }
                    )
            } else {
                console.log(err)
            }

        } catch (error) {
            next(err)
        }


    },

    ///-------------------all user in admin side
    getAdminAllUser: (req, res, next) => {
        try {
            User.find({}, function (err, result) {
                if (err) {
                    res.send(err);
                } else {
                    console.log(result)

                    res.render('admin/admin-alluser', { result })
                }
            });

        } catch (error) {
            next(err)
        }

    },
    //=----------------------------edit product in admin side
    getAdminEditProduct: (req, res, next) => {
        try {
            return new Promise(async (resolve, reject) => {
                await product.findById(req.params.id).then((result) => {
                    resolve(result)
                })
            }).then((result) => {
                console.log(result)
                res.render('admin/admin-editProduct', { result })
            })

        } catch (error) {
            next(err)
        }


    },

    //----------------------------delect product by admin
    getAdminDeleteProduct: async (req, res, next) => {
        try {
            const prodId = req.params.id
            console.log(prodId)
            prod = await product.findById(prodId)
            prod.access = false,
                await prod.save()
            res.redirect('/admin/all-product')

        } catch (error) {
            next(err)
        }

    },

    getAdminUndelectProduct: async (req, res, next) => {
        try {
            const prodId = req.params.id
            console.log(prodId)
            const undelect = await product.findById(prodId)
            console.log(undelect)
            undelect.access = true,
                await undelect.save()
            res.redirect('/admin/all-product')

        } catch (error) {
            next(err)
        }

    },



    getAdminProductUpdate: (req, res, next) => {
        try {
            const imagename = []
            for (file of req.files) {
                imagename.push(file.filename)
            }
 
            product.find({ _id: req.params.id }, (err, data) => {
                product.updateOne({ _id: req.params.id }, {
                    $set: {
                        name: req.body.name,
                        description: req.body.description,
                        price: req.body.price,
                        quantity: req.body.quantity,
                        category: req.body.category,
                        image: imagename
                    }
                }).then((data) => {
                    console.log(data);
                })
                res.redirect('/admin/all-product')
            })

        } catch (error) {
            next(err)
        }
    },
    //====================================================================================================

    //==================user block
    getAdminBlockUser: async (req, res, next) => {
        try {
            let userId = req.params.id
            useril = await user.findOne({ _id: (userId) })
            useril.access = false
            await useril.save()
            res.redirect('/admin/all-user')

        } catch (error) {
            next(err)
        }

    },


    getAdminUnblockAllUser: async (req, res, next) => {
        try {
            let userId = req.params.id
            let userun = await user.findOne({ _id: (userId) })
            userun.access = true
            await userun.save()
            res.redirect('/admin/all-user')

        } catch (error) {
            next(err)
        }

    },

    getAdminAddCategoryPage: (req, res, next) => {
        try {
            category.find({}, (err, ans) => {
                if (err) {
                    console.log(err)
                    res.render('admin/admin-addCategory', { ans: [] })        //what is the porpose
                } else {

                    res.render('admin/admin-addCategory', { ans })
                }
            })

        } catch (error) {
            next(err)
        }

    },

    //-------------------add category and send catogory name to that page in .then
    getAdminAddCategory: (req, res, next) => {
        try {
            category.find({ name: req.body.name }, (err, data) => {

                if (data.length == 0) {
                    const newcategory = new category({
                        name: req.body.name

                    })
                    newcategory.save()
                        .then(data => {
                            console.log('38')
                            console.log(data);

                            res.redirect('/admin/categoryPage')
                        })
                        .catch(err => {
                            console.log(err)
                            console.log('246')
                        })
                } else {
                    console.log("249")
                    categoryErr = "category already added"
                    res.redirect('/admin/categoryPage')
                }


            })

        } catch (error) {
            next(err)
        }

    },

    getAdminDeleteCategory: (req, res, next) => {
        try {
            product.find({ category: req.params.name }).then((productsList) => {
                console.log("masood")
                console.log(productsList, 55555555)
                if (productsList.length < 1) {
                    console.log(productsList.length, 8888)
                    // const catId = req.params.id
                    // console.log(catId)
                    category.deleteOne({ name: req.params.name }).then((result) => {
                        console.log("findbyid remove")
                        console.log(result)
                        res.json({ status: true })

                    }).catch((err) => {
                        console.log(err)
                    })
                }
                else {
                    res.redirect('/admin/categoryPage')
                }
            })

        } catch (error) {
            next(err)
        }



    },

    getAdminViewCategorey: (req, res, next) => {
        try {
            let viewprod = req.params.id
            console.log(viewprod)
            product.find({ category: viewprod }, (err, data) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log(data)
                    res.render('admin/admin-viewProductbycar', { data })
                }
            })

        } catch (error) {
            next(err)
        }

    },

    getAdminBanner: (req, res, next) => {
        try {
            bannerSchema.find({}, (err, ans) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log(ans)
                    res.render('admin/admin-banner', { ans })
                }
            })

        } catch (error) {
            next(err)
        }

    },

    getAdminBannerPost: (req, res, next) => {
        try {
            const imagename = []
            for (file of req.files) {
                imagename.push(file.filename)
            }

            const banner = new bannerSchema({

                name: req.body.name,
                image: imagename,
                access: true,

            })
            console.log(banner)
            banner.save()
            res.redirect('/admin/banneraddpage')

        } catch (error) {
            next(err)
        }

    },

    getBannerBlock: async (req, res, next) => {
        try {
            prodId = req.params.id
            let newbanner = await bannerSchema.findOne({ _id: (prodId) })
            newbanner.access = false
            await newbanner.save()

            res.redirect('/admin/banneraddpage')

        } catch (error) {
            next(err)
        }


    },

    getAdminUnblockBanner: async (req, res, next) => {
        try {
            prodId = req.params.id
            let edbanner = await bannerSchema.findOne({ _id: (prodId) })
            edbanner.access = true
            await edbanner.save()
            res.redirect('/admin/banneraddpage')

        } catch (error) {
            next(err)
        }

    },

    getOrderManagment: async (req, res, next) => {
        try {
            const userOrder = await orderSchema.find({}).sort({date: -1}).populate("products.productId").exec()
            console.log(userOrder[0].products)
            res.render('admin/admin-orderManagment', { userOrder })

        } catch (error) {
            next(err)
        }
        // let userId=req.session.user._id    

    },

    getveiwOneProduct: async (req, res, next) => {
        try {
            const prodId = req.params.id

            const newOder = await orderSchema.findOne({ _id: (prodId) })

            res.render('admin/admin-oneProduct', { newOder })

        } catch (error) {
            next(err)
        }

    },

    getchargeDeliveryStatus: async (req, res, next) => {
        try {
            console.log('orderManagment')
            const proId = req.params.id
            const prodstatus = req.body
            console.log(prodstatus.status)
            const update = await orderSchema.findOne({ _id: (proId) })
            update.status = prodstatus.status
            await update.save()
            res.redirect('/admin/orderManagment')

        } catch (error) {
            next(err)
        }


    },

    getaddCouponPage: async (req, res, next) => {
        try {
            let couponpro = await couponSchema.find()

            res.render('admin/admin-coupon', { couponpro })

        } catch (error) {
            next(err)
        }

    },

    getAddCoupon: async (req, res, next) => {
        try {
            let { name, couponCode, discount, expDate } = req.body

            const coupon = new couponSchema({
                name,
                couponCode,
                discount,
                expDate,
                isActive: true

            })
            
            await coupon.save()
            res.redirect('/admin/adminCoupon')

        } catch (error) {
            next(err)
        }


    },

    getsalesReport: async (req, res, next) => {
        try {
            const salesreport = await orderSchema.find({})
            console.log("haem")
            console.log(salesreport)
            res.render('admin/admin-salesReport', { salesreport })
        } catch (error) {
            next(err)
        }

    },

    getdelectCoupon:async(req,res,next)=>{
        try{
            couponId=req.params.id
        await couponSchema.findByIdAndDelete(couponId)
        res.redirect('/admin/adminCoupon')

        }catch(error){
            next(err)
        }
        
    }






}


