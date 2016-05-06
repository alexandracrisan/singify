'use strict';

var express = require('express');
var router = express.Router();
var authCtrl = require('../controllers/authentication');
var passport = require('passport');
var config = require('../../config/');


if (config.accessRoutes) {
	router.post('/signin', authCtrl.signin);
}
//router.get('/signout', authCtrl.signout);

module.exports = router;
