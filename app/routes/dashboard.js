'use strict';

var express = require('express');
var router = express.Router();
var dashboardCtrl = require('../controllers/dashboard');
var passport = require('passport');
var config = require('../../config/');
var auth = require('../middlewares/authentication');
var upload = require('../../config/multer').init();


router.post(
	'/dashboard',
	auth.ensured,
	upload.single('file'),
	dashboardCtrl.create,
	dashboardCtrl.jsonPost
);

//router.get('/signout', authCtrl.signout);


module.exports = router;