(function() {
	'use strict';

	angular
		.module('app')
		.controller('KaraokeCtrl', KaraokeCtrl);

	KaraokeCtrl.$inject = ['$state', '$scope', 'UtilKaraokeService', 'KaraokeService'];

	function KaraokeCtrl($state, $scope, UtilKaraokeService, KaraokeService) {
		this.song= {};
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

		$scope.fileSelectHandler = function($event) {
			console.log("Changed");

			$event.stopPropagation();
			$event.preventDefault();
			dropable.css('visibility', 'hidden');

			var droppedFiles = $event.target.files || $event.dataTransfer.files;
			console.log(droppedFiles);

			var reader = new FileReader();

			reader.onload = function(fileEvent) {
				var data = fileEvent.target.result;
				UtilKaraokeService.initAudio(data);

				var dv = new jDataView(this.result);

				if (dv.getString(3, dv.byteLength - 128) == 'TAG') {
					var title = dv.getString(30, dv.tell());
					var artist = dv.getString(30, dv.tell());
					var album = dv.getString(30, dv.tell());
					var year = dv.getString(4, dv.tell());
				} else {
					// no ID3v1 data found.
				//	currentSong.innerHTML = 'Playing';
				}
				console.log(this.result);
			};

console.log($event.target.files);
			reader.readAsArrayBuffer(droppedFiles[0]);
		};

		this.upload = function($form) {
			//console.log($form);
			//var data = new FormData($form);
			//console.log(data);
			var file = this.song;
			console.dir(file);

			var upload = {
				file: this.song,
				title: this.title
			};
			KaraokeService.uploadSong(upload).then(function(response) {
				console.log(response);
			},
			function(error) {
				console.log(error);
			});
		}
	}
})();
