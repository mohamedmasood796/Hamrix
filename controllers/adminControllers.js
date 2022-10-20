const admin = require('../models/admin')
const product = require('../models/productSchema')
const User = require("../models/user")
const category = require('../models/categorySchema')

const collection = require('../config/collection')
const user = require('../models/user')
const { render } = require('ejs')

module.exports = {
    getAdminHome: (req, res) => {
        if (req.session.adminloggedIn) {
            res.render('admin/admin-home')
        } else {
            res.redirect('/admin/admin-login')
        }

    },

    getAdminLogin: (req, res) => {
        res.render('admin/admin-login')
    },

    //-----------------------------------admin post login---------------------

    getAdminLoginPost: (req, res) => {

        const email = req.body.email
        const password = req.body.password
        admin.findOne({ adminEmail: email }, (err, data) => {
            if (data) {
                if (password == data.password) {
                    req.session.adminloggedIn = true
                    req.session.user = data
                    res.redirect('/admin/')
                } else {
                    req.session.loginErr = true
                    console.log("password incorrect")
                    res.redirect('/admin/admin-login')
                }
            } else {
                console.log("data not found")
                res.redirect('/admin/admin-login')
            }
        })

    },

    //add product by admin
    getAdminAllProduct: (req, res) => {
        // return new Promise(async(resolve,reject)=>{
        //     let product =await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
        //     console.log(product+'zfvsfxvszc')
        //     resolve(product)
        // })

        product.find({}, function (err, result) {
            if (err) {
                res.send(err);
            } else {
                res.render('admin/admin-allproduct', { result })

            }
        });
    },
    //add product by admin
    getAdminAddProduct: (req, res) => {
        category.find({},(err,data)=>{
            if(err){
                console.log(err)
            }else{
                res.render('admin/admin-addproduct',{data})
            }
        })
        
    },

    //add product post methord
    getAdminAddProductPost: (req, res) => {
        console.log(req.body)
        const name = req.body.name
        const description = req.body.description
        const price = req.body.price
        const category = req.body.category
        const image = req.body.image

        let files = req.files
        if (files) {
            let Images = []
            for (i = 0; i < req.files.length; i++) {
                Images[i] = files[i].filename
            }
            req.body.image = Images
            const addProduct = new product({ name: name, price: price, description: description, category: category, image: Images })
            console.log(addProduct)
            addProduct.save().then((result) => {
                res.redirect('/admin/add-product')
            }
            )
        } else {
            console.log(err)
        }

    },

    ///-------------------all user in admin side
    getAdminAllUser: (req, res) => {
        User.find({}, function (err, result) {
            if (err) {
                res.send(err);
            } else {
                console.log(result)
                res.render('admin/admin-alluser', { result })
            }
        });
    },
    //=----------------------------edit product in admin side
    getAdminEditProduct: (req, res) => {
        return new Promise(async (resolve, reject) => {
            await product.findById(req.params.id).then((result) => {
                resolve(result)
            })
        }).then((result) => {
            console.log(result)
            res.render('admin/admin-editProduct', { result })
        })

    },

    //--------------------------update product post methord

    // getAdminProductUpdate:(req, res) => {
    //     return new Promise(async (resolve, reject) => {
    //         await product.findOneAndUpdate(req.params.id, {
    //                 name: req.body.name,
    //                 description: req.body.description,
    //                 price: req.body.price,
    //                 category: req.body.category
    //             }
    //         ).then((result) => {
    //             resolve(result)
    //         })

    //     }).then((result) => {
    //         // console.log(result)
    //         res.redirect('/admin/all-product')
    //     })
    // },


    getAdminProductUpdate: async (req, res) => {
        proId = req.params.id
        let productde = await product.findOne({ _id: (proId) })
        productde.name = req.body.name,
            productde.description = req.body.description,
            productde.price = req.body.price,
            productde.category = req.body.category
        await productde.save()
        res.redirect('/admin/all-product')
    },


    //==================user block
    getAdminBlockUser: async (req, res) => {
        let userId = req.params.id
        useril = await user.findOne({ _id: (userId) })
        useril.access = false
        await useril.save()
        res.redirect('/admin/all-user')
    },


    getAdminUnblockAllUser: async (req, res) => {
        let userId = req.params.id
        let userun = await user.findOne({ _id: (userId) })
        userun.access = true
        await userun.save()
        res.redirect('/admin/all-user')
    },

    getAdminAddCategoryPage: (req, res) => {
        category.find({}, (err, ans) => {
            if(err){
                console.log(err)
                res.render('admin/admin-addCategory',{ans:[]})        //what is the porpose
            }else{
                
                res.render('admin/admin-addCategory',{ans})
            }
        })
        // ,function(err,ans){
        //     if(err){
        //         console.log(err)
        //         res.render('admin/admin-addCategory',{ans:[]})
        //     }else{
        //         console.log(ans);
        //         res.render('admin/admin-addCategory',{ans})
        //     }
        // }
        
    },

    //-------------------add category and send catogory name to that page in .then
    getAdminAddCategory: (req, res) => {
        const newcategory = new category({
            name: req.body.name
        })

        newcategory.save()
            .then(data => { 
                res.redirect('/admin/categoryPage')
            })

    },

    getAdminDeleteCategory:(req,res)=>{
        let deleteId=req.params.id
         category.deleteOne({_id:(deleteId)},(err,data)=>{
            if(err){
                console.log(err)
            }else{
                res.redirect('/admin/categoryPage')
            }
        })
    },

     getAdminViewCategorey:(req,res)=>{
        let viewprod=req.params.id
        product.find({category:viewprod},(err,data)=>{
            if(err){
                console.log(err)
            }else{
                //console.log(data)
                res.render('admin/admin-viewProductbycar',{data})
            }
        })
        
    }



}


