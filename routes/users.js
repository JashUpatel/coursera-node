var express = require('express');
const bodyParser = require('body-parser');
var passport = require('passport');
var authenticate = require('../authenticate');
var cors = require('./cors');

var User = require('../models/user');

var router = express.Router();


router.use(bodyParser.json());

/* GET users listing. */
router.get('/', cors.cors, authenticate.verifyUser, authenticate.verifyAdmin, function(req, res, next) {
  console.log(req.user);
 
  User.find({})
  .then((users)=>{
    res.statusCode=200;
    res.setHeader('Content-Type','application/json');
        res.json(users);
    },(err)=>next(err))
    .catch((err)=>next(err));
  // res.send('respond with a resource');
});


router.post('/signup', cors.corsWithOptions, (req, res, next) => {
// as we are using paasport local mongoose 
// it provide plugin for authentications
// so no need to find and compare method to verify
// it provide register method to verify any user


  // User.findOne({username: req.body.username})

  User.register(new User({username: req.body.username}),
   req.body.password, (err, user) => {
  
    // as we are using passport local mongoose authentication 
    // we need to change the code from regular
    // no need to use then()
    // simulateously if(user) is also not requires

  // .then((user) => {
    // if(user != null) {
    //   var err = new Error('User ' + req.body.username + ' already exists!');
    //   err.status = 403;
    //   next(err);
    // }
    if(err){
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err: err});
      
    }
    else {
      // return User.create({
      //   username: req.body.username,
      //   password: req.body.password});

      // passport will authenticate user

      if (req.body.firstname)
        user.firstname = req.body.firstname;
      if (req.body.lastname)
        user.lastname = req.body.lastname;
        
      user.save((err, user) => {
          if (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json({err: err});
            return ;
     }
     
     passport.authenticate('local')(req, res, () => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({success: true, status: 'Registration Successful!'});
    });
    });
  }
  });

  // no need to use then method as it is handled by passport local

//   .then((user) => {
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'application/json');
//     res.json({status: 'Registration Successful!', user: user});
//   }, (err) => next(err))
//   .catch((err) => next(err));

});

router.post('/login',cors.corsWithOptions,  passport.authenticate('local'), (req, res, next) => {

// update part 3 using jwt tokens 
// now we no longer need seesion to verify user
// using token and sending this token on request will handle authentication

  var token = authenticate.getToken({_id: req.user._id});

  // no need to use this code
  // login willbe handled by pasport


  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, token: token, status: 'You are successfully logged in!'});



  // if(!req.session.user) {
  //   var authHeader = req.headers.authorization;
    
  //   if (!authHeader) {
  //     var err = new Error('You are not authenticated!');
  //     res.setHeader('WWW-Authenticate', 'Basic');
  //     err.status = 401;
  //     return next(err);
  //   }
  
  //   var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
  //   var username = auth[0];
  //   var password = auth[1];
  
  //   User.findOne({username: username})
  //   .then((user) => {
  //     if (user === null) {
  //       var err = new Error('User ' + username + ' does not exist!');
  //       err.status = 403;
  //       return next(err);
  //     }
  //     else if (user.password !== password) {
  //       var err = new Error('Your password is incorrect!');
  //       err.status = 403;
  //       return next(err);
  //     }
  //     else if (user.username === username && user.password === password) {
  //       req.session.user = 'authenticated';
  //       res.statusCode = 200;
  //       res.setHeader('Content-Type', 'text/plain');
  //       res.end('You are authenticated!')
  //     }
  //   })
  //   .catch((err) => next(err));
  // }
  // else {
  //   res.statusCode = 200;
  //   res.setHeader('Content-Type', 'text/plain');
  //   res.end('You are already authenticated!');
  // }

})

router.get('/logout', cors.cors, (req, res, next) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else {
    var err = new Error('You are not logged in!');
    err.status = 403;
    next(err);
  }
});

// fb login route

router.get('/facebook/token', passport.authenticate('facebook-token'), (req, res) => {
  if (req.user) {
    var token = authenticate.getToken({_id: req.user._id});
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true, token: token, status: 'You are successfully logged in!'});
  }
});



module.exports = router;
