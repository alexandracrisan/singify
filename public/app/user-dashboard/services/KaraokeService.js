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

			return deffer.promise;
		};

		return factory;
	}
})();
