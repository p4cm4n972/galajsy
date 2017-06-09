var express = require('express');
var router = express.Router();
const passport = require('passport');
const bluebird = require('bluebird');
const crypto = bluebird.promisifyAll(require('crypto'));
const nodemailer = require('nodemailer');
const User = require('../models/User');

router.route('/login')
    .get(function (req, res, next) {
        if (req.user) {
            return res.redirect('/');
        }
        res.render('account/login', {
            title: 'Login'
        });
    })
    .post(function (req, res, next) {
        req.assert('email', 'Email is not valid').isEmail();
        req.assert('password', 'Password cannot be blank').notEmpty();
        req.sanitize('email').normalizeEmail({
            remove_dots: false
        });

        const errors = req.validationErrors();

        if (errors) {
            req.flash('errors', errors);
            return res.redirect('/login');
        }

        passport.authenticate('local', function (err, user, info) {
            if (err) {
                return next(err);
            }
            if (!user) {
                req.flash('errors', info);
                return res.redirect('/login');
            }
            req.logIn(user, function (err) {
                if (err) {
                    return next(err);
                }
                req.flash('success', {
                    msg: 'Success! You are logged in.🙂 '
                });
                res.redirect(req.session.returnTo || '/');
            });
        })(req, res, next);
    });

    
    

module.exports = router;