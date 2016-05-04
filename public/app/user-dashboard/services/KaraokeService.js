(function () {
	'use strict';

	angular
		.module('app')
		.factory('KaraokeService', KaraokeService);

	KaraokeService.$inject = ['$q', 'UtilService', '$http'];

	function KaraokeService($q, UtilService, $http) {
		var factory = {},
			base = UtilService.baseUrl + '/dashboard';

		factory.uploadSong = function (song) {
			var deffer = $q.defer();
			console.log(song);
			var fd = new FormData();
			fd.append('file', song.file);
			fd.append('title', song.title);
			console.log(fd);
			var request = UtilService.postEntity(base, fd);

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
