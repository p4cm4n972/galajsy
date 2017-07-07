var express = require('express');
var session = require('express-session');
var MongoStore = require('connect-mongo/es5')(session);
var flash = require('express-flash'); 
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var chalk = require('chalk');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');

/**
 * AWS 
 */
var app = express();

/**
 * 
 */



var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');

require('./passport');
var config = require('./config');

var index = require('./routes/index');
var contact = require('./routes/contact');
var about = require('./routes/about');
var login = require('./routes/login');
var signup = require('./routes/signup');
var account = require('./routes/account');
var accountPass = require('./routes/accountPass');
var accountDel = require('./routes/accountDel');
var reset = require('./routes/reset');
var forgot = require('./routes/forgot');
var square = require('./routes/square');
var article = require('./routes/article');

/**
 * Connect to MongoDB.
 */
mongoose.Promise = global.Promise;
mongoose.connect(config.dbConnstring);
global.User = require('./models/User');
global.Square = require('./models/Square');
global.Article = require('./models/Article');
mongoose.connection.on('error', function(err) {
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
  process.exit();
})


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(cookieParser());
app.use(session({
  secret: config.sessionKey,
  resave: true,
  saveUninitialized: true,
 /* store: new MongoStore({
    url: config.dbConnstring,
    autoReconnect: true,
    clear_interval: 3600
  })*/
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use(function (req, res, next) {
  // After successful login, redirect to the authenticate page
  if (req.isAuthenticated()) {
    res.locals.user = req.user;
  }
  next();
});
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/', contact);
app.use('/', about);
app.use('/', login);
app.use('/', signup);
app.use('/', account);
app.use('/', accountPass);
app.use('/', accountDel);
app.use('/', reset);
app.use('/', forgot);
app.use('/', square);
app.use('/', article);
/**
 * OAuth authentication routes. (Sign in)
 */
app.get('/auth/facebook', passport.authenticate('facebook', {
  scope: ['email', 'public_profile']
}));
app.get('/auth/facebook/callback', passport.authenticate('facebook', {
  failureRedirect: '/login'
}), function (req, res) {
  res.redirect(req.session.returnTo || '/');
});
app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback', passport.authenticate('twitter', {
  failureRedirect: '/login'
}), function (req, res) {
  res.redirect(req.session.returnTo || '/');
});
app.get('/auth/instagram', passport.authenticate('instagram'));
app.get('/auth/instagram/callback', passport.authenticate('instagram', {
  failureRedirect: '/login'
}), function (req, res) {
  res.redirect(req.session.returnTo || '/');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

