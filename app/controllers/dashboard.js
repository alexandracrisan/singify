'use strict';

var SONG_TYPES = ['audio/mp3', 'audio/ogg', 'audio/wav'];
var _ = require('lodash');
var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../../config');
var Song = mongoose.model('Song');
var FileStorage = require('../services/filestorage')({
	type: config.filestore.storagetype
});

module.exports.create = createPost;
module.exports.jsonPost = jsonPost;

function createPost(req, res, next) {
	console.log(34);
	var is,
			tempPath,
			extension;
	console.log(req);
	var data = _.pick(req.body, ['title']);
	data.user = req.user._id;

	var postData = new Song(data);

	if (req.file) {
		var file = req.file;
		tempPath = file.path;
		extension = 'mp3';
		postData.filename = postData.hash + '.' + extension;
		console.log(req.file);

		if (SONG_TYPES.indexOf(file.mimetype) == -1) {
			return res.status(415).json({
				message: 'Supported formats: .mp3, .ogg, .wav'
			});
		}

		if(!postData.title) {
			return res.status(400).json({
				message: 'Title is required!'
			});
		}
console.log('tempPath',tempPath);
console.log('postData.filename',postData.filename);
console.log('file',file);
		FileStorage.store({
			filepath: tempPath,
			filename: postData.filename,
			file: file
		}, function(err, file) {
			//if (err) {
			//	return res.status(400).json({
			//		type: err.type,
			//		message: err.message
			//	});
			//}

			if (err) {
				console.log('ctrl', err);
				return next(err);
			}

			Song.create(postData, function(err, post) {
				if (err) {
					console.log('song', err);
					return next(err);
				}
				req.resources.post = post;
				next();
			});
		});
	}
}

function jsonPost(req, res, next) {
	console.log('post',  req.resources.post);
	res.json(req.resources.post);
}