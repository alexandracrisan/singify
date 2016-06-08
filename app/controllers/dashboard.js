'use strict';

var SONG_TYPES = ['audio/mp3', 'audio/ogg', 'audio/wav', 'image/jpeg', 'image/png', 'video/mp4',
	'video/quicktime', 'video/x-msvideo', 'video/x-ms-wmv', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
var MIMETYPE_PDF = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
var MIMETYPE_IMG = ['image/jpeg', 'image/png'];
var _ = require('lodash');
var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../../config');
var Media = mongoose.model('Media');
var FileStorage = require('../services/filestorage')({
	type: config.filestore.storagetype
});
var PDFImage = require('pdf-image').PDFImage;
var im = require('imagemagick');

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

	//console.log(req.body);
	//console.log(req.file, 'fielleellele');

	var postData = new Media(data);

	if (req.file) {
		var file = req.file;
		tempPath = file.path;
		extension = 'mp3';
		postData.filename = postData.hash + '.' + extension;

		if (SONG_TYPES.indexOf(file.mimetype) == -1) {
			return res.status(415).json({
				message: 'Supported formats: .mp3, .ogg, .wav, .jpeg, .jpg, .jpe, .png, .mp4, .mov, .avi, .wmv'
			});
		}

		if (MIMETYPE_PDF.indexOf(file.mimetype) > -1) {
				console.log(file, 'in mimetype');
			postData.filename = postData.hash + '.pdf';
			//var pdfImage = new PDFImage(file.path);
			//
			//pdfImage.convertPage(0).then(function (imagePath) {
			//	console.log(567, imagePath);
			//}, function (err) {
			//	console.log(err);
			//});

		}
		if (MIMETYPE_IMG.indexOf(file.mimetype) > -1) {
			console.log(file, 'in mimetype img');
			postData.filename = postData.hash + '.jpg';
			//var pdfImage = new PDFImage(file.path);
			//
			//pdfImage.convertPage(0).then(function (imagePath) {
			//	console.log(567, imagePath);
			//}, function (err) {
			//	console.log(err);
			//});

		}

		FileStorage.store({
			filepath: tempPath,
			filename: postData.filename,
			file: file
		}, function(err, file) {

			if (err) {
				return next(err);
			}

			Media.create(postData, function(err, post) {
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

	Media
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
	//res.json(req.resources.post);
	res.redirect('/dashboard');
}

function jsonSongs(req, res, next) {
	if(!req.resources.songs) {
		return res.status(400).json({
			message: 'No songs available'
		});
	}
	res.json(req.resources.songs);
}
