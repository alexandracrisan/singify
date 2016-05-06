(function() {
	'use strict';

	angular
		.module('app')
		.controller('SignupCtrl', SignupCtrl);

	SignupCtrl.$inject = ['SignupService', '$state', '$scope', 'SessionService'];

	function SignupCtrl(SignupService, $state, $scope, SessionService) {
		$scope.current_user_ui = {};

		$scope.register = function() {
			SignupService.createUser($scope.current_user_ui).then(

				function(response) {
					console.log(response);
					SessionService.setCurrentUser(response);
					$state.go('/dashboard');
				},
				function(error) {
					$scope.current_user_ui = {};
					console.log(error);
				});
		};
	}
})();
