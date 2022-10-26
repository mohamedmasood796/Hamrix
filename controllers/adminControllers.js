const admin = require('../models/admin')
const product = require('../models/productSchema')
const User = require("../models/user")
const category = require('../models/categorySchema')

const collection = require('../config/collection')
const user = require('../models/user')
const { render } = require('ejs')
const { findById } = require('../models/admin')
const bannerSchema=require("../models/bannerSchema")


let categoryErr;
let adminloginErr;



module.exports = {
    getAdminHome: (req, res) => {
        if (req.session.adminloggedIn) {
            let admin = req.session.user
            res.render('admin/admin-home', { admin })
        } else {
            res.render('admin/admin-login', { adminloginErr })
            adminloginErr = null
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
                    adminloginErr = "invalid password"
                    res.redirect('/admin/')
                }
            } else {
                console.log("data not found")
                adminloginErr = "invalid email"
                res.redirect('/admin/')
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
        category.find({}, (err, data) => {
            if (err) {
                console.log(err)
            } else {
                res.render('admin/admin-addproduct', { data })
            }
        })

    },

    //add product post methord
    getAdminAddProductPost: (req, res) => {
        console.log(req.body)
        const name = req.body.name
        const description = req.body.description
        const price = req.body.price
        const quantity= req.body.quantity
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
                  quantity:quantity,
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

    //----------------------------delect product by admin
    getAdminDeleteProduct: async (req, res) => {
        const prodId = req.params.id
        console.log(prodId)
        prod = await product.findById(prodId)
        prod.access = false,
            await prod.save()
        res.redirect('/admin/all-product')
    },

    getAdminUndelectProduct: async (req, res) => {
        const prodId = req.params.id
        console.log(prodId)
        const undelect = await product.findById(prodId)
        console.log(undelect)
        undelect.access = true,
            await undelect.save()
        res.redirect('/admin/all-product')
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


    getAdminProductUpdate:  (req, res) => {
        console.log(req.files)
        console.log(req.file)

        const imagename = []
        for (file of req.files) {
            imagename.push(file.filename)
        }
        // proId = req.params.id
        // let productde = await product.findOne({ _id: (proId) })  //productde =_id ulla full document
        //     productde.name = req.body.name,
        //     productde.description = req.body.description,
        //     productde.price = req.body.price,
        //     productde.category = req.body.category
        //     productde.image=image
        // await productde.save()
        // res.redirect('/admin/all-product')   

        

        product.find({ _id: req.params.id }, (err, data) => {
            product.updateOne({ _id: req.params.id }, {
                $set: {
                    name : req.body.name,
                    description : req.body.description,
                    price : req.body.price,
                    quantity:req.body.quantity,
                    category : req.body.category,
                    image:imagename
                }
            }).then((data)=>{
                console.log(data);
            })
            res.redirect('/admin/all-product')  
        })


    },
    //====================================================================================================

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
            if (err) {
                console.log(err)
                res.render('admin/admin-addCategory', { ans: [] })        //what is the porpose
            } else {

                res.render('admin/admin-addCategory', { ans })
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



        // const newcategory = new category({
        //     name: req.body.name
        // })

        // newcategory.save()
        //     .then(data => { 
        //         res.redirect('/admin/categoryPage')
        //     })

    },

    getAdminDeleteCategory: (req, res) => {
        console.log(req.params.name)

        product.find({ category: req.params.name }).then((productsList) => {
            console.log("masood")
            console.log(productsList,55555555)
            if (productsList.length <1) {
                console.log(productsList.length,8888)
                const catId = req.params.id
                console.log(catId)
                category.deleteOne({ name: req.params.name }).then((result) => {
                    console.log("findbyid remove")
                    console.log(result)

                }).catch((err) => {
                    console.log(err)
                })
                res.redirect('/admin/categoryPage')
            }
            else {
                res.redirect('/admin/categoryPage')
            }
        })



        // product.find({category:req.params.name}).then((productList)=>{
        //     if(productList.length == 0){
        //         let deleteId=req.params.id
        //  category.deleteOne({_id:(deleteId)},(err,data)=>{
        //     if(err){
        //         console.log(err)
        //     }else{
        //         res.redirect('/admin/categoryPage')
        //     }
        // })


        //     }

        //})

    },

    getAdminViewCategorey: (req, res) => {
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
    },

    getAdminBanner:(req,res)=>{
        bannerSchema.find({},(err,ans)=>{
            if(err){
                console.log(err)
            }else{
                console.log(ans)
                res.render('admin/admin-banner',{ans})
            }
        }) 
    },

    getAdminBannerPost:(req,res)=>{
        const imagename = []
        for (file of req.files) {
            imagename.push(file.filename)
        }

        const banner=new bannerSchema({

            name:req.body.name,
            image:imagename,
            access: true,

        })
        console.log(banner)
        banner.save()
        res.redirect('/admin/banneraddpage')
    },

    getBannerBlock:async(req,res)=>{
        prodId=req.params.id
        let newbanner= await bannerSchema.findOne({_id:(prodId)})
        newbanner.access=false
        await newbanner.save()
        
        res.redirect('/admin/banneraddpage')

    },

    getAdminUnblockBanner:async(req,res)=>{
        prodId=req.params.id
        let edbanner=await bannerSchema.findOne({_id:(prodId)})
        edbanner.access=true
        await edbanner.save()
        res.redirect('/admin/banneraddpage')
    }






}


