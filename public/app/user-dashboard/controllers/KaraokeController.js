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
		var lastPlaylistItemNode;
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

		$scope.fileSelectHandler = function($event) {
			$event.preventDefault();
			$event.stopPropagation();

			dropable.css('visibility', 'hidden');

			var droppedFiles = $event.target.files || $event.dataTransfer.files;

			var reader = new FileReader();
			var files;
			var $imageName = $('.song-name');

			reader.onload = function(fileEvent) {
				var data = fileEvent.target.result;
				UtilKaraokeService.loading();
				UtilKaraokeService.initAudio(data, 'fileUpload', true);

			};

			if ($event.target) {
				if($event.target.files[0]) {
					files = $event.target.files[0].name;
				}
			}

			$imageName.text(files);
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
				sidebar.find('.available').text('No songs available');
			}
			else {
				sidebar.mCustomScrollbar('destroy');
				sidebar.find('.available').text('');
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
						songElem += '<li><a class="available">No songs available</a></li>'
					}
					else {
						response.forEach(function(val, index) {
							songElem += '<li><a class="song-item pointer" data-filename="' + val._id + '">'+ val.title +
								'<span class="sub_icon glyphicon glyphicon-play"></span></a></li>';
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
		});

		var $tracksBar = $('.tracks-bar');
		var $backBtn = $('.backward-btn');
		var $forwardBtn = $('.forward-btn');
		var $pauseBtn = $('.pause-btn');

		$('#sidebar').on('click', '.song-item', function(e) {
			trackStarter(this);
		});
		$tracksBar.on('click', '.backward-btn', playPrevTrack);
		$tracksBar.on('click', '.forward-btn', playNextTrack);
		$tracksBar.on('click', '.pause-btn', pauseTrack);
		$tracksBar.on('click', '.play-btn', playTrack);

		function trackStarter(elem) {
			var dataFileName = $(elem).attr('data-filename');
			var urlFileName = UtilService.baseUrl+ '/files/' + dataFileName;
			var $prevItem = $(elem).parent().prev().find('.song-item');
			var $nextItem = $(elem).parent().next().find('.song-item');

			if(!$prevItem.length) {
				$backBtn.prop("disabled", true );
			}
			else {
				$backBtn.prop("disabled", false );
			}
			if(!$nextItem.length) {
				$forwardBtn.prop("disabled", true );
			}
			else {
				$forwardBtn.prop("disabled", false );
			}

			lastPlaylistItemNode = $(elem);

			KaraokeService.getFile(urlFileName).then(
				function(response) {
					UtilKaraokeService.loading();
					window.original = response;
					UtilKaraokeService.initAudio(response, 'trackList', true);
				}
			)
		}

		function playPrevTrack(e) {
			var $prevItem = lastPlaylistItemNode.parent().prev().find('.song-item');
			trackStarter($prevItem);
			lastPlaylistItemNode = $prevItem;
		}

		function playNextTrack(e) {
			var $nextItem = lastPlaylistItemNode.parent().next().find('.song-item');
			trackStarter($nextItem);
			lastPlaylistItemNode = $nextItem;
		}

		function pauseTrack(e) {
			window.source.stop(0);
			window.source.disconnect(0);
			clearInterval(window.source.interval);
			window.source = null;
			$(this).replaceWith('<button type="button" id="pause-play" title="Play/Resume" class="btn btn-default btn-circle btn-lg play-btn">' +
				'<span class="glyphicon glyphicon-play"></span></button>');
		}

		function playTrack(e) {
			UtilKaraokeService.loading();
			UtilKaraokeService.initAudio(window.original, 'trackList', false);
			$(this).replaceWith('<button type="button" id="pause-play" title="Pause" class="btn btn-default btn-circle btn-lg pause-btn">' +
				'<span class="glyphicon glyphicon-pause"></span></button>');
		}

	}
})();

