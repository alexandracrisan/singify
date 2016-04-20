'use strict';

const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/authentication');
const passport = require('passport');
const config = require('../../config/');


if (config.accessRoutes) {
	router.post('/signin', authCtrl.signin);
}
//router.get('/signout', authCtrl.signout);


module.exports = router;
