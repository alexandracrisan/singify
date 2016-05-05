'use strict';

var express = require('express');
var router = express.Router();
var accountCtrl = require('../controllers/account');
var config = require('../../config/');

router.post('/signup', accountCtrl.signup);

module.exports = router;

