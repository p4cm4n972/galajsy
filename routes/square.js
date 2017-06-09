var express = require('express');
var router = express.Router();
var Square = require('../models/Square');

router.get('/createSquare', function (req, res) {
    var newSquare = new Square();
    newSquare.save(function (err, data) {
        if (err) {
            console.log(err);
            res.render('error');
        } else {
            res.redirect('/square/' + data._id);
        };
    });
});

router.get('/square/:id', function (req, res) {
    if (req.params.id) {
        Square.findOne({
            _id: req.params.id
        }, function (err, data) {
            if (err) {
                console.log(err);
                res.render('error');
            }
            if (data) {
                res.render('square', {
                    data: data
                });
            } else {
                res.render('error');
            }
        });
    } else {
        res.render('error');
    }
});

module.exports = router;