var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var FileStore = require('session-file-store')(session);

var passport = require('passport');
var authenticate = require('./authenticate');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require('./routes/dishRouter');
var promoRouter = require('./routes/promoRouter');
var leaderRouter = require('./routes/leaderRouter');
const uploadRouter = require('./routes/uploadRouter');
var favouriteRouter = require('./routes/favouriteRouter');
var config = require('./config');

const mongoose = require('mongoose');

const Dishes = require('./models/dishes');
const { runInNewContext } = require('vm');

// const url = 'mongodb://localhost:27017/confusion';
const url = config.mongoUrl;

const connect = mongoose.connect(url);

connect.then((db)=>{
  console.log('connected to server');
},(err)=>{console.log(err);}
)


var app = express();

// to redirect all the request to https

app.all('*', (req,res,next)=>{
  if(req.secure){
    return next();
  }
  else{
    res.redirect(307, 'https://'+ req.hostname + ':' + app.get('secPort') + req.url);
  }
})


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');





app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser('12345-67890-09876-54321'));

// no longer using session 
// use of jwt

// app.use(session({
//   name: 'session-id',
//   secret: '12345-67890-09876-54321',
//   saveUninitialized: false,
//   resave: false,
//   store: new FileStore()
// }));

// use passport after session
// as session needs to initiated first


app.use(passport.initialize());
// app.use(passport.session());


// this two routes are used above so that this two routes can be accessed 
// without authentication
// any route defined below auth function will require to be authnticated


app.use('/', indexRouter);
app.use('/users', usersRouter);



// new updated auth function after passport 
// update part3 after jwt tokens
// no need to authenticate every req
// only on particular request so commenting out

// function auth (req, res, next) {
//   console.log(req.user);

//   if (!req.user) {
//     var err = new Error('You are not authenticated!');
//     err.status = 403;
//     next(err);
//   }
//   else {
//         next();
//   }
// }


// auth finction before passport

// function auth (req, res, next) {
// //after using passport authentication function is also needs to update


//   // console.log(req.headers);
//   // var authHeader = req.headers.authorization;

//   // // if (!req.signedCookies.user) {
//   // if (!req.session.user) {
  
//   // if (!authHeader) {  // this is handled by user route
//   // you need to authenticate using /login method
//       var err = new Error('You are not authenticated!');
//       res.setHeader('WWW-Authenticate', 'Basic');
//       err.status = 403;
//       next(err);
//       return;
//   // }


//   // not required as it is taken care in users route

//   // var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
//   // var user = auth[0];
//   // var pass = auth[1];
//   // if (user == 'admin' && pass == 'password') {
//   //   // res.cookie('user','admin',{signed: true});

//   //   // req.session.user = 'admin';

//   //   // we have set session in users route to authenticated

//   //   req.session.user = 'authenticated';


//   //   next(); // authorized
//   // } else {
//   //     var err = new Error('You are not authenticated!');
//   //     res.setHeader('WWW-Authenticate', 'Basic');      
//   //     err.status = 401;
//   //     next(err);
//   // }

// }

// else {
//   // if (req.signedCookies.user === 'admin') {
//   if (req.session.user === 'authenticated') {

//       next();
//   }
//   else {
//       var err = new Error('You are not authenticated!');
//       err.status = 403;
//       next(err);
//   }
// }
// }

// app.use(auth);



app.use(express.static(path.join(__dirname, 'public')));

app.use('/dishes',dishRouter);
app.use('/promotions',promoRouter);
app.use('/leaders',leaderRouter);
app.use('/imageUpload',uploadRouter);
app.use('/favourites',favouriteRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
