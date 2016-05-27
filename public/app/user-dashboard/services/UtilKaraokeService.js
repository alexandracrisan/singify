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
			mix2;
		var context = new (window.AudioContext || window.webkitAudioContext)();

		factory.initAudio = function (data, processMode, duration) {
			if (source) source.stop(0);

			source = context.createBufferSource();

			if (context.decodeAudioData) {
				context.decodeAudioData(data, function (buffer) {
					source.buffer = buffer;
					createAudio(processMode, duration);
				}, function (e) {
					console.error(e);
				});
			} else {
				source.buffer = context.createBuffer(data, false);
				createAudio(processMode, duration);
			}
		};

		function createAudio(processMode, duration) {
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
			processMode == 'trackList' ? renderTracksBar() : '';
			duration ? source.start(0, duration) : source.start(0);

			window.source = source;
			console.log(source.buffer.duration);

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

		function renderTracksBar() {
			var $tracksBar = $('.tracks-bar');
			$tracksBar.css('visibility', 'visible');
		}

		return factory;
	}
})();
