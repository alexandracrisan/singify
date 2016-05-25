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
module.exports.getAllSongs = getAllSongs;
module.exports.jsonPost = jsonPost;
module.exports.jsonSongs = jsonSongs;

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
				return next(err);
			}

			Song.create(postData, function(err, post) {
				if (err) {
					return next(err);
				}
				req.resources.post = post;
				next();
			});
		});
	}
}

function getAllSongs(req, res, next) {
	var query = {};
	query.sort = { createdAt: -1 };
	query.find = {user: req.user._id};

	Song
		.find(query.find)
		.sort(query.sort)
		.populate('user')
		.exec(function(err, songs) {
			if (err) {
				return next(err);
			}

			req.resources.songs = songs;
			next();
		});
}

function jsonPost(req, res, next) {
	res.json(req.resources.post);
}

function jsonSongs(req, res, next) {
	if(!req.resources.songs) {
		return res.status(400).json({
			message: 'No songs available'
		});
	}
	res.json(req.resources.songs);
}
