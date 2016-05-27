'use strict';

module.exports = {
	port: 3002,
	hostname: "127.0.0.1",
	baseUrl: 'http://localhost:3000',
	mongodb: {
		uri: "mongodb://localhost/singify_dev_db"
	},
	app: {
		name: "singify"
	},
	serveStatic: true,
	session: {
		secret: 'On#MustNotGiv3S#cretsAwAy!2any1',
		type: 'mongodb',                          // store type, default `memory`
		resave: false,                            // save automatically to session store
		saveUninitialized: true                   // save new sessions
	},
	filestore: {
		storagetype: 'disk',
		readertype: 'disk'
	},
	assets: {
	    url: 'http://localhost:3000/files'
	},
	//facebook: {
	//    appID: 'facebook_app_id',
	//    appSecret: 'facebook_app_secret',
	//    callbackURL: 'http://localhost:3000/auth/facebook/callback'
	//},
	//migration: true,
	accessRoutes: true // in production set to false
};