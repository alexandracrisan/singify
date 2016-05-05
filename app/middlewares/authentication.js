'use strict';

module.exports.ensured = function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		console.log(2345);
		return next();
	}

	//res.redirect('/signin');
	res.format({
		html: function() {
			console.log(1);
			res.redirect('/signin');
		},
		text: function() {
			console.log(2);
			res.redirect('/signin');
		},
		json: function() {
			console.log(3);
			res.status(401).json({ message: 'Unauthorized' });
		}
	});
};
