var express = require('express');
var router = express.Router();
const bluebird = require('bluebird');
const crypto = bluebird.promisifyAll(require('crypto'));
const passport = require('passport');
const User = require('../models/User');

router.route('/signup')
    .get(function (req, res, next) {
        if (req.user) {
            return res.redirect('/');
        }
        res.render('account/signup', {
            title: 'Create Account'
        });
    })
    .post(function (req, res, next) {
        req.assert('email', 'Email is not valid').isEmail();
        req.assert('password', 'Password must be at least 4 characters long').len(6);
        req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);
        req.sanitize('email').normalizeEmail({
            remove_dots: false
        });

        var errors = req.validationErrors();

        if (errors) {
            req.flash('errors', errors);
            return res.redirect('/signup');
        }

        var user = new User({
            email: req.body.email,
            password: req.body.password
        });

        User.findOne({
            email: req.body.email
        }, function (err, existingUser) {
            if (err) {
                return next(err);
            }
            if (existingUser) {
                req.flash('errors', {
                    msg: 'Account with that email address already exists!'
                });
                return res.redirect('/signup');
            }
            user.save(function (err) {
                if (err) {
                    return next(err);
                }
                req.logIn(user, function (err) {
                    if (err) {
                        return next(err);
                    }
                    res.redirect('/login');
                });
            });
        });
    });

module.exports = router;