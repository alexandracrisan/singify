'use strict';

const config = require('./index');

module.exports.init = function (app) {
	var routesPath = app.get('root') + '/app/routes';

	if (config.accessRoutes) {
		app.use('/', require(routesPath + '/account'));
	}
	app.use('/', require(routesPath + '/authentication'));
	app.use('/', require(routesPath + '/dashboard'));

	if (config.filestore.readertype === 'disk') {
		app.use('/', require(routesPath + '/files'));
	}

	//app.get('files/:filename/:page', function (req, res) {
	//	var pdfPath = 'files/' + req.params.filename;
	//	var pageNumber = req.params.page;
	//
	//	var PDFImage = require("pdf-image").PDFImage;
	//	var pdfImage = new PDFImage(pdfPath);
	//
	//	pdfImage.convertPage(pageNumber).then(function (imagePath) {
	//		res.sendFile(imagePath);
	//	}, function (err) {
	//		res.status(500).send(err);
	//
	//	//var exec = require('child_process').exec;
	//	//
	//	//exec('gs -dNOPAUSE -sDEVICE=jpeg -r144 -sOutputFile=p%03d.jpg r19nWaVE.pdf' , function(err) {
	//	//	if (err) {
	//	//		// something went wrong
	//	//		console.log('retgrth', err);
	//	//	} else {
	//	//		// everything went good do something after the process is completed
	//	//		console.log('good')
	//	//	}
	//	//});
	//	});
	//});

	app.get('*', function (req, res) {
		res.sendFile(app.get('root') + '/public/index.html');
	});
};
