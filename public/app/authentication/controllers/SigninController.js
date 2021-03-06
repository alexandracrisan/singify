(function() {
	'use strict';

	angular
		.module('app')
		.controller('SigninCtrl', SigninCtrl);

	SigninCtrl.$inject = ['SigninService', '$state', '$scope', 'SessionService'];

	function SigninCtrl(SigninService, $state, $scope, SessionService) {
		$scope.current_user_ui = {};

		$scope.signin = function() {
			SigninService.loginUser($scope.current_user_ui).then(
				function(response) {
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
