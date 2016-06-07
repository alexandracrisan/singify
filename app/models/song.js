'use strict';

var mongoose = require('mongoose');
var shortId = require('shortid');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;


var SongSchema = new Schema({
	hash: {
		type: String,
		unique: true,
		default: function() {
			return shortId.generate();
		}
	},
	user: {
		type: ObjectId,
		ref: 'User',
		required: true
	},
	//title: {
	//	type: String,
	//	required: false
	//},
	filename: {
		type: String
	},
	createdAt: {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model('Song', SongSchema);