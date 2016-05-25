(function () {
	'use strict';

	angular
		.module('app')
		.factory('KaraokeService', KaraokeService);

	KaraokeService.$inject = ['$q', 'UtilService', '$http'];

	function KaraokeService($q, UtilService, $http) {
		var factory = {},
			deffer,
			base = UtilService.baseUrl + '/dashboard',
			songsPath = UtilService.baseUrl + '/songs';

		factory.uploadSong = function (song) {
			deffer = $q.defer();

			return deffer.promise;
		};

		factory.getUserSongs = function() {
			deffer = $q.defer();
			var request = UtilService.getEntity(songsPath);

			request
				.success(function (data, status, headers, config) {
					deffer.resolve(data);
				}).
				error(function (data, status, headers, config) {
					deffer.reject(status);
					console.log(status);
				});

			return deffer.promise;
		};

		return factory;
	}
})();
