(function () {
	'use strict';

	angular.module('app', ['ui.router'])
		.config(function ($stateProvider, $urlRouterProvider,  $locationProvider) {
			$urlRouterProvider.otherwise('/');

			$stateProvider
				.state('/', {
					url: '/',
					templateUrl: 'app/account/partials/home-page.html'
				})
				.state('/dashboard', {
					url: '/dashboard',
					params: {
						loggedUser: null
					},
					templateUrl: 'app/presentation/partials/presentation.html',
					controller: 'PresentationCtrl as presentationCtrl'
				});

			$locationProvider.html5Mode(true);
		});
})();