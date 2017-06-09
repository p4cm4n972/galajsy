var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/User');

router.post('/account/delete', function(req, res, next){
  User.remove({
    _id: req.user.id
  }, function(err)  {
    if (err) {
      return next(err);
    }
    req.logout();
    req.flash('info', {
      msg: 'Your account has been deleted.'
    });
    res.redirect('/');
  });
});

module.exports = router;
