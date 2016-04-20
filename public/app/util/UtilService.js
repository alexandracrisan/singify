(function () {
	'use strict';

	angular
		.module('app')
		.factory('UtilService', UtilService);

	UtilService.$inject = ['$http'];

	function UtilService($http) {
		this.baseUrl = 'http://localhost:3002';

		this.postEntity = function (url, data) {
			return $http({
				method: 'POST',
				url: url,
				data: JSON.stringify(data),
				dataType: 'json'
			})
		};


		this.getEntity = function (url) {
			return $http({
				method: 'GET',
				url: url,
				dataType: 'json'
			})
		};

		return this;
	}
})();
