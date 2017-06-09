var express = require('express');
var router = express.Router();
var bluebird = require('bluebird');
var crypto = bluebird.promisifyAll(require('crypto'));
var nodemailer = require('nodemailer');
var config = require('../config');

router.route('/forgot')
.get(function (req, res)  {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  res.render('account/forgot', {
    title: 'Forgot Password'
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
    return res.redirect('/forgot');
  }

  var createRandomToken = crypto
    .randomBytesAsync(16)
    .then(buf => buf.toString('hex'));

  var setRandomToken = token =>
    User
    .findOne({
      email: req.body.email
    })
    .then((user) => {
      if (!user) {
        req.flash('errors', {
          msg: 'Account with that email address does not exist.'
        });
      } else {
        user.passwordResetToken = token;
        user.passwordResetExpires = Date.now() + 3600000; // 1 hour
        user = user.save();
      }
      return user;
    });

  var sendForgotPasswordEmail = (user) => {
    if (!user) {
      return;
    }
    var token = user.passwordResetToken;
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'manuel.adele@gmail.com',
        pass: 'Jean_3:16'
      }
    });
    var mailOptions = {
      to: user.email,
      from: 'proZe.com',
      subject: 'Reset your password on proZe',
      text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n
        Please click on the following link, or paste this into your browser to complete the process:\n\n
        http://${req.headers.host}/reset/${token}\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n`,
      host: 'smtp.gmail.com',
      secure: true,
      port: 465,
      auth: {
        user: 'manuel.adele@gmail.com',
        pass: 'Jean_3:16'
      }
    };
    return transporter.sendMail(mailOptions)
      .then(() => {
        req.flash('info', {
          msg: `An e-mail has been sent to ${user.email} with further instructions.`
        });
      });
  };

  createRandomToken
    .then(setRandomToken)
    .then(sendForgotPasswordEmail)
    .then(() => res.redirect('/forgot'))
    .catch(next);
});

module.exports = router;
