'use strict';

module.exports.ensured = function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		console.log(2345);
		return next();
	}

	//res.redirect('/signin');
	res.format({
		html: function() {
			res.redirect('/signin');
		},
		text: function() {
			res.redirect('/signin');
		},
		json: function() {
			res.status(401).json({ message: 'Unauthorized' });
		}
	});
};
