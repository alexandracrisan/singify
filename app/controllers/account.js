'use strict';

var _ = require('lodash');
var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports.signup = signup;

function signup(req, res, next) {
    req.session.historyData = req.body;

    //if (req.body.password !== req.body.password_confirm) {
    //    req.session.historyData.errorMessage = 'Password confirmation should match';
    //    return res.redirect('signup');
    //}

    var userData = _.pick(req.body, 'name', 'email', 'password');

    User.register(userData, function(err, user) {
        if (err && (11000 === err.code || 11001 === err.code)) {
            req.session.historyData.errorMessage = 'E-mail is already in use.';
            return res.redirect('signup');
        }

        if (err) {
            req.session.historyData.errorMessage = 'Something went wrong, please try later.';
            return res.redirect('signup');
            //res.json(err);
        }

        req.logIn(user, function(err) {
            req.session.historyData = undefined;
            //res.redirect('/');
            res.json(req.user);
            console.log(user);
        });
    });
}