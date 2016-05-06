'use strict';

var passport = require('passport');
var config = require('../../config');


module.exports.signin = function (req, res, next) {
	passport.authenticate('local', function (err, user, info) {
		if (err || !user) {

			return handleResponse(400, info, req, res);
		}
		req.logIn(user, function (err) {
			if (err) {
				return next(err);
			}

			res.status(200).json(user);
			//if (req.body.signinType == 'modal') {
			//    return res.json(user);
			//}

			//res.redirect('/');
		});
	})(req, res, next);
};

function handleResponse(status, data, req, res) {
	res.format({
		html: function () {
			req.session.historyData = data;
			res.redirect('/signin');
		},
		text: function () {
			req.session.historyData = data;
			res.redirect('/signin');
		},
		json: function () {
			res.status(status).json(data);
		}
	});
}