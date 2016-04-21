(function() {
	'use strict';

	angular
		.module('app')
		.controller('KaraokeCtrl', KaraokeCtrl);

	KaraokeCtrl.$inject = ['$state', '$scope'];

	function KaraokeCtrl($state, $scope) {
		this.song= {};
		var fileDrag = document.getElementById('upload-song');
		var dropable = $('.droppable');
		var processor,
			source,
			filterLowPass,
			filterHighPass,
			mix,
			mix2;
		var lastenter;
		var context = new (window.AudioContext || window.webkitAudioContext)();
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

			var reader = new FileReader();

			reader.onload = function(fileEvent) {
				var data = fileEvent.target.result;
				initAudio(data);

				//var currentSong = document.getElementById('current-song');
				var dv = new jDataView(this.result);

				// "TAG" starts at byte -128 from EOF.
				// See http://en.wikipedia.org/wiki/ID3
				if (dv.getString(3, dv.byteLength - 128) == 'TAG') {
					var title = dv.getString(30, dv.tell());
					var artist = dv.getString(30, dv.tell());
					var album = dv.getString(30, dv.tell());
					var year = dv.getString(4, dv.tell());
					//currentSong.innerHTML = 'Playing ' + title + ' by ' + artist;
				} else {
					// no ID3v1 data found.
				//	currentSong.innerHTML = 'Playing';
				}

			};

			console.log(droppedFiles);
			reader.readAsArrayBuffer(droppedFiles[0]);
		};

		function initAudio(data) {
			if (source) source.stop(0);

			source = context.createBufferSource();

			if (context.decodeAudioData) {
				context.decodeAudioData(data, function (buffer) {
					source.buffer = buffer;
					createAudio();
				}, function (e) {
					console.error(e);
				});
			} else {
				source.buffer = context.createBuffer(data, false);
				createAudio();
			}
		}

		function createAudio() {
			// create low-pass filter
			filterLowPass = context.createBiquadFilter();
			source.connect(filterLowPass);

			filterLowPass.type = 'lowpass';
			filterLowPass.frequency.value = 120;

			// create high-pass filter
			filterHighPass = context.createBiquadFilter();
			source.connect(filterHighPass);
			filterHighPass.type = 'highpass';
			filterHighPass.frequency.value = 120;

			// create the gain node
			mix = context.createGain();

			mix2 = context.createGain();
			source.connect(mix2);
			mix2.connect(context.destination);

			mix.gain.value = 1;
			mix2.gain.value = 0;

			// create the processor
			processor = context.createScriptProcessor(2048 /*bufferSize*/ , 2 /*num inputs*/ , 1 /*num outputs*/);

			// connect everything
			filterHighPass.connect(processor);
			filterLowPass.connect(mix);
			processor.connect(mix);
			mix.connect(context.destination);

			// connect with the karaoke filter
			processor.onaudioprocess = karaoke;

			// playback the sound
			source.start(0);

			setTimeout(disconnect, source.buffer.duration * 1000 + 1000);
		}

		function disconnect() {
			source.stop(0);
			source.disconnect(0);
			processor.disconnect(0);
			mix.disconnect(0);
			mix2.disconnect(0);
			filterHighPass.disconnect(0);
			filterLowPass.disconnect(0);
		}

		function karaoke(evt) {
			var inputL = evt.inputBuffer.getChannelData(0),
				inputR = evt.inputBuffer.getChannelData(1),
				output = evt.outputBuffer.getChannelData(0),
				len = inputL.length,
				i = 0;
			for (; i < len; i++) {
				output[i] = inputL[i] - inputR[i];
			}
		}
	}
})();

