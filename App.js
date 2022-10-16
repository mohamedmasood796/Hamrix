const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser')
const path = require('path')
const mongoose=require('./config/connection')
const app = express();
var session = require('express-session')
const nocache = require("nocache");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
app.use(nocache());


const userRouter=require('./router/user');
const adminRouter=require('./router/admin');


//static files

app.use(express.static(path.join(__dirname, 'public')));   
//app.use(express.static('public'))    public folder ullath kittan
app.use(express.static(path.join(__dirname, 'views')));
app.set('view engine', 'ejs');
app.use(session({secret:"key",cookie:{maxAge:600000},resave:true,saveUninitialized:false}))


app.use('/',userRouter);
app.use('/admin',adminRouter);


app.listen(3000,()=>{
    console.log('http://localhost:3000/');
})

// module.exports = app



// app.get('/',(req,res)=>{
//     res.render('user/user-home')
// })

// app.get('/about',(req,res)=>{
//     res.render('user/user-about')
// })

// app.get('/user-signup',(req,res)=>{
//     res.render('user/user-signup')
// })

// app.get('/user-contact',(req,res)=>{
//     res.render('user/user-contact')
// })

// app.get('/user-login',(req,res)=>{
//     res.render('user/user-login')
// })

// app.get('/admin-home',(req,res)=>{
//     res.render('admin/admin-home')
// })
// app.get('/admin-login',(req,res)=>{
//     res.render('admin/admin-login')
// })

app.get('/admin-addproducts',(req,res)=>{
  res.render('admin/admin-addproduct')
})


// const PORT = process.env.PORT || 3000;
// app.listen(PORT, console.log("Server don start for port: " + PORT))