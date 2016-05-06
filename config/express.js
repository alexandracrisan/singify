'use strict';

const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const serveStatic = require('serve-static');
const expressValidator = require('express-validator');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo')(session);
const config = require('./index');

module.exports.init = initExpress;

function initExpress(app) {

	var env = app.get('env');
	var root = app.get('root');
	var sessionOpts = {
		secret: config.session.secret,
		key: 'skey.sid',
		resave: config.session.resave,
		saveUninitialized: config.session.saveUninitialized,
	};
	/**
	 * Common express configs
	 */
	app.use(expressValidator());
	app.use(bodyParser.urlencoded({extended: true}));
	app.use(bodyParser.json());
	app.use(methodOverride());
	app.disable('x-powered-by');

	if (config.session.type === 'mongodb') {
		sessionOpts.store = new MongoStore({
			url: config.mongodb.uri,
			stringify: false,
			ttl: 3600,
			autoRemove: 'native'
		});
	}

	app.use(session(sessionOpts));
	app.use(passport.initialize());
	app.use(passport.session());

	app.use(function (req, res, next) {
		// a simple object that holds resources for each request
		req.resources = req.resources || {};
		res.locals.sess = req.session;
		res.locals.app = config.app;
		res.locals.currentUser = req.user;

		res.locals.baseUrl = config.baseUrl;
		next();
	});

	if (config.serveStatic) {
		app.use(serveStatic(path.join(root, 'public')));
	}
}
