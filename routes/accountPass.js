var express = require('express');
var router = express.Router();const bluebird = require('bluebird');
var crypto = bluebird.promisifyAll(require('crypto'));
var nodemailer = require('nodemailer');
var passport = require('passport');
var User = require('../models/User');

router.post('/account/password', function (req, res, next)  {
  req.assert('password', 'Password must be at least 4 characters long').len(4);
  req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/account');
  }

  User.findById(req.user.id, function (err, user) {
    if (err) {
      return next(err);
    }
    user.password = req.body.password;
    user.save(function (err) {
      if (err) {
        return next(err);
      }
      req.flash('success', {
        msg: 'Password has been changed.'
      });
      res.redirect('/account');
    });
  });
});

module.exports = router;
