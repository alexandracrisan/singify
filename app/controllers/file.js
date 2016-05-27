'use strict';

var MIME = {
	mp3: 'audio/mpeg'
};
var config = require('../../config');
var FileStorage = require('../services/filestorage')({ type: config.filestore.readertype });

/**
 *  Module exports
 */
module.exports.getByFilename = getByFilename;

function getByFilename(req, res, next) {
	var filename = req.params.filename;
	var extension = filename.split(/[. ]+/).pop();

	res.setHeader('Cache-Control', 'public, max-age=3600');
	res.setHeader('Content-Type', MIME[extension]+';charset=UTF-8');

	// pipe file to response
	FileStorage.serve(filename, res);
}
