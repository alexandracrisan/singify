(function () {
	'use strict';

	angular
		.module('app')
		.factory('UtilKaraokeService', UtilKaraokeService);

	UtilKaraokeService.$inject = ['$q', 'UtilService'];

	function UtilKaraokeService($q, UtilService) {
		var factory = {};
		var processor,
			source,
			filterLowPass,
			filterHighPass,
			mix,
			mix2,
			position,
			trackLength,
			secondLength;
		var isPlaying = false;
		var context = new (window.AudioContext || window.webkitAudioContext)();

		factory.initAudio = function (data, processMode, resetTimer) {
			if (source) {
				clearInterval(source.interval);
				disconnect();
				source = null;
				isPlaying = true;
			} else {
				isPlaying = false;
			}
			if (resetTimer) {
				position = 0;
			}
			source = context.createBufferSource();

			if (context.decodeAudioData) {
				context.decodeAudioData(data, function (buffer) {
					source.buffer = buffer;
					createAudio(processMode, position);
				}, function (e) {
					console.error(e);
				});
			} else {
				source.buffer = context.createBuffer(data, false);
				createAudio(processMode, position);
			}
		};

		function createAudio(processMode, position) {
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

			var interval;
			if (processMode == 'trackList') {
				interval = renderTracksBar()
			} else {
				interval = () => {};
			}
			//position ? source.start(0, position) : source.start(0);
			source.start(0, position);

			source.interval = interval;
			window.source = source;

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
 		var slider;
		function renderTracksBar() {
			var $tracksBar = $('.tracks-bar');
			trackLength = source.buffer.duration;
			$tracksBar.css('visibility', 'visible');
			slider = $tracksBar.find('input#slider');
			slider.slider({
				max: trackLength,
				value: position,
				formatter: function(value) {
					var mins = Math.floor(value / 60);
					if (mins < 10) {
						mins = '0' + mins ;
					}
					var secs = value - mins*60;
					if (secs < 10) {
						secs = '0' + secs ;
					}
					return '' + mins + 'm:' + secs + 's';
				},
			}).off('slideStop').on('slideStop', (newPosition) => {
				position = newPosition.value;
				if( isPlaying) {
					factory.initAudio(window.original, 'trackList', false);
				}

				return;
			});
			var interval = setInterval(() => {
				var offset = ++position;
				slider.slider('setValue', offset);
			}, 1000);
			setTimeout(() => {
				clearInterval(interval)
			}, trackLength * 1000);
			return interval;
		}



		return factory;
	}
})();
