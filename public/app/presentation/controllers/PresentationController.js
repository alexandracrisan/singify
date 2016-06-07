(function() {
	'use strict';

	angular
		.module('app')
		.controller('PresentationCtrl', PresentationCtrl);

	PresentationCtrl.$inject = ['$state', '$scope', 'SessionService', 'PresentationService', 'UtilService'];

	function PresentationCtrl($state, $scope, SessionService, PresentationService, UtilService) {

		this.loggedUser = SessionService.getCurrentUser();

		this.logout = function() {
			SessionService.removeCurrentUser();
			PresentationService.logout().then(
				function(response) {

					window.location.href =  UtilService.baseUrl + '/';
				},
				function(error) {
					console.log(error);
				}
			)
		};
	}
})();
