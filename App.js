const express = require('express');
require('dotenv').config()
const ejs = require('ejs');
const bodyParser = require('body-parser')
const path = require('path')
const mongoose=require('./config/connection')
const app = express();
var session = require('express-session')
const nocache = require("nocache");
const Swal = require('sweetalert2')

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



app.use(function (req, res, next) {
    next(createError(404));
  });
  
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    console.log(err);
    res.render('user/user-404');
  });



// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
//   // render the error page
//   res.status(err.status || 500);
//   res.render('user/user-404');
// });


// const PORT = process.env.PORT || 3000;
// app.listen(PORT, console.log("Server don start for port: " + PORT))