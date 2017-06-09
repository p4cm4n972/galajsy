var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Article = require('../models/Article');

router.route('/createArticle')
.get(function (req, res) {
    res.render('content/article', {
        title: 'Post'
    });
})
.post(function (req, res, next) {
        req.assert('title', 'Title cannot be blank').notEmpty();
        req.assert('content', 'Content cannot be blank').notEmpty();

        var errors = req.validationErrors();

        if (errors) {
    req.flash('errors', errors);
    return res.redirect('/createArticle');
    console.log('error');
  };

        var article = new Article({
            title: req.body.title,
            content: req.body.content,
        });
        article.save([{title: req.body.title},{content: req.body.content}], function (err, integred){
        if(err) {
            return next(err);
        }
        article.save(function (err) {
            console.log('save');
                if (err) {
                    req.flash('errors', {
                        msg: err.message
                    });
                    return res.redirect('/createArticle');
                }
                        req.flash('success', {
                            msg: 'Article has been added successfully!👍 '
                        });
                        res.redirect('/');
                });
        });
    });
    
    module.exports = router;
