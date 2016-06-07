(function () {
	'use strict';

	angular
		.module('app')
		.factory('PresentationService', PresentationService);

	PresentationService.$inject = ['$q', 'UtilService'];

	function PresentationService($q, UtilService) {
		var factory = {},
			deffer,
			base = UtilService.baseUrl + '/signin',
			logoutPath = UtilService.baseUrl + '/signout';

		factory.logout = function() {
			deffer = $q.defer();
			var request = UtilService.getEntity(logoutPath);

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
