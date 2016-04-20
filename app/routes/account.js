'use strict';

const express = require('express');
const router = express.Router();
const accountCtrl = require('../controllers/account');
const config = require('../../config/');

//router.get('/signup', accountCtrl.signupPage);
router.post('/signup', accountCtrl.signup);

module.exports = router;

