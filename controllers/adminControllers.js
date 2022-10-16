const admin=require('../models/admin')
const product=require('../models/productSchema')

module.exports={
    getAdminHome :(req,res)=>{
        res.render('admin/admin-home')
    },

    getAdminLogin:(req,res)=>{
        res.render('admin/admin-login')
    },

//-----------------------------------admin post login---------------------

    getAdminLoginPost:(req,res)=>{

        const email=req.body.email
        const password=req.body.password
        admin.findOne({adminEmail:email},(err,data)=>{
            if (data){
                if(password==data.password){
                    res.redirect('/admin/')
                }else{
                    console.log( "password incorrect")
                    res.redirect('/admin/admin-login')
                }
            }else{
                console.log("data not found")
                res.redirect('/admin/admin-login')
            }
        })
        
    },

    //add product by admin
    getAdminAllProduct:(req,res)=>{
        
        res.render('admin/admin-allproduct')
    },
    //add product by admin
    getAdminAddProduct:(req,res)=>{
        res.render('admin/admin-addproduct')
    },

    //add product post methord
    getAdminAddProductPost:(req,res)=>{
        console.log(req.body)
        const name=req.body.name
        const description=req.body.description
        const price=req.body.price
        const category=req.body.category
        const image=req.body.image

        let files=req.files
        if(files){
            let Images=[]
            for(i=0;i<req.files.length;i++){
                Images[i]=files[i].filename
            }
            req.body.image=Images
            const addProduct=new product({name:name,price:price,description:description,category:category,image:Images})
            console.log(addProduct)
        addProduct.save().then((result)=>{
            res.redirect('/admin/add-product')
        }
        )}else{
            console.log(err)
        }
        
    },


}


