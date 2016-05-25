'use strict';

var _ = require('lodash');
var DiskStorage = require('./disk')();

function FileStorage(opts) {
	/**
	 *  Determin storage instance type
	 * only `disk` storagez
	 */
	if (opts.type === 'disk') {
		this.storage = DiskStorage;
	}
}

FileStorage.prototype.store = function(opts, callback) {
	this.storage.store(opts, callback);
};

FileStorage.prototype.serve = function(filename, stream, callback) {
	this.storage.serve(filename, stream, callback);
};

module.exports = function fileFactory(opts) {
	return new FileStorage(opts);
};
