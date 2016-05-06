(function () {
	'use strict';

	angular
		.module('app')
		.factory('SessionService', SessionService);

	SessionService.$inject = ['$http'];

	function SessionService($http) {

		this.setCurrentUser = function (user) {
			localStorage.setItem('currentUser', JSON.stringify(user));
		};

		this.getCurrentUser = function() {
			return JSON.parse(localStorage.getItem('currentUser'));
		};

		this.removeCurrentUser = function (key) {
			localStorage.removeItem(key);
		};

		return this;
	}
})();
