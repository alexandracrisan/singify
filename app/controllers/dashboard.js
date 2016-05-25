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
	var is,
			tempPath,
			extension;

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


		FileStorage.store({
			filepath: tempPath,
			filename: postData.filename,
			file: file
		}, function(err, file) {

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
	res.json(req.resources.post);
}
