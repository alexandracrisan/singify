(function() {
	'use strict';

	angular
		.module('app')
		.controller('MainCtrl', MainCtrl);

	MainCtrl.$inject = ['$scope', '$state'];

	function MainCtrl($scope, $state) {

		this.showSignUp = function() {
			$state.go('/signup');
		};
		this.showSignin = function() {
			$state.go('/signin');

		}
	}
})();
