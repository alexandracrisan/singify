'use strict';

var fs = require('fs');
var path = require('path');
var dpath = '../../../writable';
var destination;

module.exports = function build() {
	init();

	return Disk;
};

function Disk() {}
Disk.store = store;
Disk.serve = streamFile;

function init() {
	var dr = path.resolve(__dirname, dpath);

	_mkdirSync(dr);
	destination = dr;
}

function store(opts, callback) {
	var targetPath = path.join(destination, opts.filename);
	var is = fs.createReadStream(opts.filepath);
	var os = fs.createWriteStream(targetPath);
console.log('tagert', targetPath);
	//is.on('error', function(err) {
	//	if (err) {
	//		console.log('service', err);
	//		return callback(err);
	//	}
	//});
	console.log(4567890);
	//os.on('close', function() {
	//	//delete file from temp folder
	//	fs.unlink(opts.filepath, function(err) {
	//		if (err) {
	//			console.log('unlink', err);
	//			return callback(err);
	//		}
os.on('open', function(fd) {
	is.on('data', function(data) {
		console.log('loading');
		os.write(data);
	});
	is.on('end', function() {
		console.log('finn');
		callback(null, {
			status: 200,
			filename: opts.filename,
			message: 'File stored.'
		});
		os.end();
	})
})

			console.log(4567890);
	//	});
	//});
}


function streamFile(filename, outputStream, callback) {
	callback = callback || function() {};

	var targetPath = path.join(destination, filename);
	var is = fs.createReadStream(targetPath);

	is.pipe(outputStream);

	is.on('error', function(err) {
		if (err) {
			return callback(err);
		}
	});

	outputStream.on('close', function() {
		// TODO: better message
		callback(null, {
			status: 200,
			filename: filename,
			message: 'File streaming finished.'
		});
	});
}

function _mkdirSync(folderPath) {
	try {
		fs.mkdirSync(folderPath);
	} catch(e) {
		if ( e.code != 'EEXIST' ) throw e;
	}
}