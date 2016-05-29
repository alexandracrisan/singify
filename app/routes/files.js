'use strict';

const express = require('express');
const router = express.Router();
const fileCtrl = require('../controllers/file');
var auth = require('../middlewares/authentication');

router.get('/files/:id', auth.ensured, fileCtrl.getSongById, fileCtrl.getByFilename);

module.exports = router;
