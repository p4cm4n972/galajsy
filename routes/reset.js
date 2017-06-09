var express = require('express');
var router = express.Router();const bluebird = require('bluebird');
var crypto = bluebird.promisifyAll(require('crypto'));
var nodemailer = require('nodemailer');
var passport = require('passport');
var User = require('../models/User');

router.route('/account/reset')
.get(function (req, res, next)  {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  User
    .findOne({
      passwordResetToken: req.params.token
    })
    .where('passwordResetExpires').gt(Date.now())
    .exec(function (err, user)  {
      if (err) {
        return next(err);
      }
      if (!user) {
        req.flash('errors', {
          msg: 'Password reset token is invalid or has expired.'
        });
        return res.redirect('/forgot');
      }
      res.render('account/reset', {
        title: 'Password Reset'
      });
    });
})
.post(function (req, res, next)  {
  req.assert('password', 'Password must be at least 4 characters long.').len(4);
  req.assert('confirm', 'Passwords must match.').equals(req.body.password);

  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('back');
  }

  var resetPassword = () =>
    User
    .findOne({
      passwordResetToken: req.params.token
    })
    .where('passwordResetExpires').gt(Date.now())
    .then(function (user)  {
      if (!user) {
        req.flash('errors', {
          msg: 'Password reset token is invalid or has expired.'
        });
        return res.redirect('back');
      }
      user.password = req.body.password;
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      return user.save().then(() => new Promise((resolve, reject) => {
        req.logIn(user, (err) => {
          if (err) {
            return reject(err);
          }
          resolve(user);
        });
      }));
    });

  var sendResetPasswordEmail = function (user) {
    if (!user) {
      return;
    }
    var  transporter = nodemailer.createTransport(config.mailer);
    var mailOptions = {
      to: user.email,
      from: 'proZe.com',
      host: 'smtp.gmail.com',
      secure: true,
      port: 465,
      subject: 'Your proZe password has been changed',
      text: `Hello,\n\nThis is a confirmation that the password for your account ${user.email} has just been changed.\n`,
      auth: {
        user: 'manuel.adele@gmail.com',
        pass: 'Jean_3:16'
      }
    };
    return transporter.sendMail(mailOptions)
      .then(() => {
        req.flash('success', {
          msg: 'Success! Your password has been changed.'
        });
      });
  };

  resetPassword()
    .then(sendResetPasswordEmail)
    .then(() => {
      if (!res.finished) res.redirect('/');
    })
    .catch(err => next(err));
});

module.exports = router;
