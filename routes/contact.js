var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var config = require('../config');


var transporter = nodemailer.createTransport(config.mailer);

router.route('/contact')
    .get(function (req, res, next) {
        res.render('contact', {
            title: 'Contact'
        });
    })
    .post(function (req, res, next) {
        req.assert('name', 'Name cannot be blank').notEmpty();
        req.assert('email', 'Email is not valid').isEmail();
        req.assert('message', 'Message cannot be blank').notEmpty();

        const errors = req.validationErrors();

        if (errors) {
            req.flash('errors', errors);
            return res.redirect('/contact');
        }

        const mailOptions = {
            to: 'manuel.adele@gmail.com',
            from: `${req.body.name} <${req.body.email}>`,
            host: 'smtp.gmail.com',
            secure: true,
            port: 465,
            subject: 'Contact Form | proZe 🤖 ',
            text: req.body.message,
            auth: {
                user: 'manuel.adele@gmail.com',
                pass: 'Jean_3:16',
            }
        };

        transporter.sendMail(mailOptions, function (err) {
            if (err) {
                req.flash('errors', {
                    msg: err.message
                });
                return res.redirect('/contact');
            }
            req.flash('success', {
                msg: 'Email has been sent successfully!👄 '
            });
            res.redirect('/');
        });
    })

module.exports = router;