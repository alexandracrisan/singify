(function () {
	'use strict';

	angular
		.module('app')
		.factory('SigninService', SigninService);

	SigninService.$inject = ['$q', 'UtilService'];

	function SigninService($q, UtilService) {
		var factory = {},
			base = UtilService.baseUrl + '/signin';

		factory.loginUser = function (userCredentials) {
			var deffer = $q.defer();
			var request = UtilService.postEntity(base, userCredentials);

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
