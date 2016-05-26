(function() {
	'use strict';

	angular
		.module('app')
		.controller('KaraokeCtrl', KaraokeCtrl);

	KaraokeCtrl.$inject = ['$state', '$scope', 'UtilKaraokeService', 'KaraokeService', 'UtilService', 'SessionService'];

	function KaraokeCtrl($state, $scope, UtilKaraokeService, KaraokeService, UtilService, SessionService) {
		this.base = UtilService.baseUrl + '/dashboard';
		this.loggedUser = SessionService.getCurrentUser();

		var fileDrag = document.getElementById('upload-song');
		var dropable = $('.droppable');
		var dr = document.getElementById('droppable');
		var lastenter;
		var xhr = new XMLHttpRequest();

		if (xhr.upload) {
			// file drop
			fileDrag.addEventListener('dragenter', fileDragEnter, false);
			fileDrag.addEventListener('dragleave', fileDragLeave, false);
			dr.addEventListener('drop', $scope.fileSelectHandler, false);
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
			$event.preventDefault();
			$event.stopPropagation();

			dropable.css('visibility', 'hidden');

			var droppedFiles = $event.target.files || $event.dataTransfer.files;

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
			};

			reader.readAsArrayBuffer(droppedFiles[0]);
		};

		this.toggleMenu = function($event) {
			$event.preventDefault();
			var sidebar = $('#sidebar');
			var wrapper = sidebar.parents('#wrapper');
			wrapper.toggleClass("active");

			if(wrapper.hasClass('active')) {
				sidebar.mCustomScrollbar({
					theme: 'rounded-dots',
					scrollInertia: 1400
				});
			}
			else {
				sidebar.mCustomScrollbar('destroy');
			}
		};

		this.logout = function() {
			SessionService.removeCurrentUser();
			KaraokeService.logout().then(
				function(response) {

					window.location.href =  UtilService.baseUrl + '/';
				},
				function(error) {
					console.log(error);
				}
			)
		};

		$scope.$on('$viewContentLoaded', function(){
			KaraokeService.getUserSongs().then(
				function(response) {
					var sidebar = $('#sidebar');
					var songElem = '';
					var wrapper = sidebar.parents('#wrapper');

					if(!response.length) {
						songElem += '<li><a>No songs available</a></li>'
					}
					else {
						response.forEach(function(val, index) {
							songElem += '<li><a>'+ val.title +'<span class="sub_icon glyphicon glyphicon-play"></span></a></li>'
						});
					}

					sidebar.append(songElem);

					sidebar.mCustomScrollbar({
						theme: 'rounded-dots',
						scrollInertia: 1400
					});
				},
				function(error) {
					console.log(error);
				}
			)
		});

		//trigger click on input type file
		$('#upload-song')
		.on('click', function(e) {
			$('.upload-song-input').trigger('click');
		})
		.on('click', '.upload-song-input', function(e) {
				e.stopPropagation();
		})

	}
})();

