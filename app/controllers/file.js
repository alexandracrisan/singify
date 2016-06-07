'use strict';

var MIME = {
	mp3: 'audio/mpeg',
	pdf: 'application/pdf'
};
var config = require('../../config');
var FileStorage = require('../services/filestorage')({ type: config.filestore.readertype });
var mongoose = require('mongoose');
var Song = mongoose.model('Song');

/**
 *  Module exports
 */
module.exports.getByFilename = getByFilename;
module.exports.getSongById = getSongById;

function getByFilename(req, res, next) {
	var filename = req.resources.filename;
	var extension = filename.split(/[. ]+/).pop();

	res.setHeader('Cache-Control', 'public, max-age=3600');
	res.setHeader('Content-Type', MIME[extension]+';charset=UTF-8');

	// pipe file to response
	FileStorage.serve(filename, res);
}

function getSongById(req, res, next) {
	var fileId = req.params.id;

	Song
		.findOne({_id: fileId, user: req.user })
		.exec(function(err, song) {
			if (err) {
				return next(err);
			}

			if(!song) {
				return res.status(403).json({
					message: 'Unauthorized!'
				});
			}

			req.resources.filename = song.filename;
			next();
		});
}