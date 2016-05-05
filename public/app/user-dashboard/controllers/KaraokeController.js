(function() {
	'use strict';

	angular
		.module('app')
		.controller('KaraokeCtrl', KaraokeCtrl);

	KaraokeCtrl.$inject = ['$state', '$scope', 'UtilKaraokeService', 'KaraokeService'];

	function KaraokeCtrl($state, $scope, UtilKaraokeService, KaraokeService) {
		this.song = {};
		this.songContent = {};
		this.processedSong = {};
		this.title = '';
		var fileDrag = document.getElementById('upload-song');
		var dropable = $('.droppable');
		var lastenter;
		var xhr = new XMLHttpRequest();

		if (xhr.upload) {
			// file drop
			fileDrag.addEventListener('dragenter', fileDragEnter, false);
			fileDrag.addEventListener('dragleave', fileDragLeave, false);
			fileDrag.addEventListener('drop', $scope.fileSelectHandler, false);
		}

		function fileDragEnter(e) {
			lastenter = event.target;
			dropable.css('visibility', 'visible');
			return false;
		}
		function fileDragLeave(e) {
			if (lastenter === event.target) {
				dropable.css('visibility', 'hidden');
			}
			return false;
		}

		var self = this;

		$scope.fileSelectHandler = function($event) {
			console.log("Changed");

			$event.stopPropagation();
			$event.preventDefault();
			dropable.css('visibility', 'hidden');

			var droppedFiles = $event.target.files || $event.dataTransfer.files;
			console.log(droppedFiles);

			var reader = new FileReader();

			reader.onloadend = function(fileEvent) {
				var data = fileEvent.target.result;
			//	//reader.readAsDataURL($event.target.files[0]);
				self.songContent = data;
				console.log(fileEvent);
				//self.songContent = data;
			//	UtilKaraokeService.initAudio(data);
			//	var dv = new jDataView(this.result);
			//
			//	if (dv.getString(3, dv.byteLength - 128) == 'TAG') {
			//		var title = dv.getString(30, dv.tell());
			//		var artist = dv.getString(30, dv.tell());
			//		var album = dv.getString(30, dv.tell());
			//		var year = dv.getString(4, dv.tell());
			//	} else {
			//		// no ID3v1 data found.
			//	//	currentSong.innerHTML = 'Playing';
			//	}
			//	console.log(dv);
			};

			//var stuff = reader.readAsArrayBuffer(self.song);
			self.song = droppedFiles[0];
			reader.readAsBinaryString(droppedFiles[0]);
		};

		this.upload = function($form) {
			console.log($form);
			var data = new FormData($form);
			//console.log(data);
			var file = self.song;
			console.dir(file);

			var upload = {
				file: self.song,
				fileContent: self.songContent,
				title: this.title
			};
			KaraokeService.uploadSong(data).then(function(response) {
				console.log(response);
			},
			function(error) {
				console.log(error);
			});
		}
	}
})();

