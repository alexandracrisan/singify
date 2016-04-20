'use strict';

const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('User');

module.exports.init = function (app) {
	passport.serializeUser(function (user, done) {
		done(null, user.toObject());
	});

	passport.deserializeUser(function (user, done) {
		//User.findById(id, done);
		done(null, user);
	});

	// load strategies
	require('./strategies/local')();
	//require('./strategies/facebook')();
};
