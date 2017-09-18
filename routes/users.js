var express = require('express');
var router = express.Router();
var multer = require('multer');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var upload = multer({dest: './uploads'});
var User = require('../models/user');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', function(req, res, next) {
  res.render('register', {title:'Register'});
});

router.get('/login', function(req,res,next){
  res.render('login', {title: 'login'});
});

router.post('/login',
  passport.authenticate('local',{failureRedirect: '/users/login',failureFlash: 'Invalid username or password'}),
  function(req, res) {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    req.flash('success','You are now logged in');
    res.redirect('/polls/create');
  });

  /* Passport functions. Don't touch these */
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
      done(err, user);
    });
  });

passport.use(new LocalStrategy(function(username,password, done){
  User.getUserByUsername(username, function(err, user) {
    if (err) throw err;
    if (!user) {
      console.log('This user does not exit. Please register.');
      return done(null, false, {message: 'This user does not exit. Please register.'});
    }
    User.comparePassword(password, user.password, function(err, isMatch) {
      if (err) throw err;
      if (isMatch) {
        return done(null, user);
      } else {
        console.log('Invalid password or username.');
        return done(null, false, {message: 'Invalid password or username. Please try again.'});
      }
    });
  });
}));
router.post('/register',upload.single('profileimage'), function(req,res,next){
  console.log(req.body);
  var name = req.body.name;
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  var password = req.body.password2;
  if(req.file){
    console.log("Uploading...")
    var profileimage = req.file.filename;
  }
  else{
    console.log("No file...");
      var profileimage = "No image.jpg"
  }

  //form validator
  req.checkBody('name',"Name field is required").notEmpty();
  req.checkBody('email',"Email field is required").notEmpty();
  req.checkBody('email',"Email is not valid").isEmail();
  req.checkBody('username',"Username field is required").notEmpty();
  req.checkBody('password',"Password field is required").notEmpty();
  req.checkBody('password2',"Password is not match").equals(req.body.password);
  //Check errors
  var errors = req.validationErrors();
  if(errors){
    res.render('register',{
      errors: errors
    });
  }
  else {
      var newUser = new User({
        name: name,
        email: email,
        username: username,
        password: password
      });
    }

  // Save the new user to the database
  User.createUser(newUser, function(err, user) {
    if (err) throw err;
    console.log(user);

    // automatically log new user in
    req.login(user, function(err) {
      if (err) { return next(err); }
      req.flash('success', 'You are now registered!');
      return res.redirect('/polls/mypolls');
    });
  });
});


router.get('/logout', function(req, res) {
  req.logout();
  req.flash('success', 'You have logged out');
  res.redirect('/');
});




module.exports = router;
