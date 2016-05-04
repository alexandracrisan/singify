'use strict';

const express = require('express');
const router = express.Router();
const dashboardCtrl = require('../controllers/dashboard');
const passport = require('passport');
const config = require('../../config/');
const auth = require('../middlewares/authentication');


router.post('/dashboard', auth.ensured, dashboardCtrl.create);

//router.get('/signout', authCtrl.signout);


module.exports = router;