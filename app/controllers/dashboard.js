'use strict';

var _ = require('lodash');
var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../../config');

module.exports.create = createPost;

function createPost(req, res, next) {
	var data = _.pick(req.body, ['title']);
	console.log(req.file);
}