'use strict';

const express = require('express');
const router = express.Router();
const fileCtrl = require('../controllers/file');

router.get('/files/:filename', fileCtrl.getByFilename);

module.exports = router;
