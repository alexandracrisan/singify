'use strict';

var MIME = {
	mp3: 'audio/mpeg',
	pdf: 'application/pdf',
	jpeg: 'image/jpeg',
	jpg: 'image/jpeg',
	png: 'image/png',
	mp4: 'audio/mp4'
};
var config = require('../../config');
var FileStorage = require('../services/filestorage')({ type: config.filestore.readertype });
var mongoose = require('mongoose');
var Media = mongoose.model('Media');
var PDFImage = require("pdf-image").PDFImage;
var exec = require("child_process").exec;

/**
 *  Module exports
 */
module.exports.getByFilename = getByFilename;
module.exports.getSongById = getSongById;
module.exports.getPage = getPage;

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

	Media
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
			req.resources.writablePath = req.resources.basePath + '\\writable\\';
			next();
		});
}

function getPage(req, res, next) {
	var pdfPath = req.resources.filename;
	var extension = pdfPath.split(/[. ]+/).pop();
	var pageNumber = req.params.page;
	var changeDir = req.resources.writablePath + pdfPath;


	var pdfImage = new PDFImage(changeDir);
	pdfImage.convertPage(pageNumber).then(function (imagePath) {
		res.setHeader('Cache-Control', 'public, max-age=3600');
		res.setHeader('Content-Type', MIME[extension]+';charset=UTF-8');
		//res.sendFile(imagePath);
		FileStorage.serve(imagePath, res);
	}, function (err) {
		res.status(500).send(err);

	});
}