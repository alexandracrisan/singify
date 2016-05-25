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
					templateUrl: 'app/user-dashboard/partials/user-dashboard.html',
					controller: 'KaraokeCtrl as karaokeCtrl'
				});

			$locationProvider.html5Mode(true);
		});
})();