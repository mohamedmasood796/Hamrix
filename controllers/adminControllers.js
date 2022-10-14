const admin=require('../models/admin')

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
            console.log(data)
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
        
    }
}


