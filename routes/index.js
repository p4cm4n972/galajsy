var express = require('express');
var router = express.Router();
var User = require('../models/User');

var articleName;
var response;

/* GET home page. */
router.get('/', function(req, res, next) {
  var article = function  () { Article.find({},{'content':1,_id:0}, function(err, exist){
    if(exist) {
      var articleJsonList = JSON.stringify(exist);
            var articleArrayList = JSON.parse(articleJsonList);
            
            var articleName = articleArrayList;
            console.log(articleName);
            return articleName;
            
    };
  });
}
var response = article();
  console.log(response);
  User.find({},{'email':1,_id:0}, function(err, exist){
    if(exist) {
      var memberJsonList = JSON.stringify(exist);
            var memberArrayList = JSON.parse(memberJsonList);
            
            var memberName = memberArrayList;
            res.render('index', {
                title: 'GalaJSy',
                memberName: memberName
            });
    };
  });
});

/**
 * GET /logout
 * Log out.
 */
router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});



module.exports = router;
