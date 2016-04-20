(function() {
	'use strict';

	angular
		.module('app')
		.controller('SignupCtrl', SignupCtrl);

	SignupCtrl.$inject = ['SignupService', '$state'];

	function SignupCtrl(SignupService, $state) {
		this.current_user_ui = {};
		var self = this;

		this.register = function() {
			SignupService.createUser(self.current_user_ui).then(
				function(response) {
					console.log(response);
					$state.go('/dashboard');
				},
				function(error) {
					self.current_user_ui = {};
					console.log(error);
				});
		};
	}
})();
