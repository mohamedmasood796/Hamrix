const admin = require('../models/admin')
const product = require('../models/productSchema')
const User = require("../models/user")

const collection = require('../config/collection')

module.exports = {
    getAdminHome: (req, res) => {
        res.render('admin/admin-home')
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
                    res.redirect('/admin/')
                } else {
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
        res.render('admin/admin-addproduct')
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


    getAdminProductUpdate:async(req,res)=>{
        proId=req.params.id
        productde= await product.findOne({_id:(proId)})
        productde.name= req.body.name,
        productde.description= req.body.description,
        productde.price= req.body.price,                
        productde.category= req.body.category
        await productde.save()
        res.redirect('/admin/all-product')
    }




}


