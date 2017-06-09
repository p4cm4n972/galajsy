var express = require('express');
var router = express.Router();
var bluebird = require('bluebird');
var crypto = bluebird.promisifyAll(require('crypto'));
var nodemailer = require('nodemailer');
var passport = require('passport');
var User = require('../models/User');

router.route('/account')
.get(function (req, res, next)  {
  res.render('account/profile', {
    title: 'Account Management'
  });
})
.post(function (req, res, next)  {
  req.assert('email', 'Please enter a valid email address.').isEmail();
  req.sanitize('email').normalizeEmail({
    remove_dots: false
  });

  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/account');
  }

  User.findById(req.user.id, function (err, user)  {
    if (err) {
      return next(err);
    }
    user.email = req.body.email || '';
    user.profile.name = req.body.name || '';
    user.profile.gender = req.body.gender || '';
    user.profile.location = req.body.location || '';
    user.profile.website = req.body.website || '';
    user.save(function (err)  {
      if (err) {
        if (err.code === 11000) {
          req.flash('errors', {
            msg: 'The email address you have entered is already associated with an account.'
          });
          return res.redirect('/');
        }
        return next(err);
      }
      req.flash('success', {
        msg: 'Profile information has been updated.'
      });
      res.redirect('/account');
    });
  });
});


module.exports = router;
