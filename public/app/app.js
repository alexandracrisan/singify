(function () {
    'use strict';

    angular.module('appMy', ['ui.router'])
        .config(function($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('/');

            $stateProvider
                .state('/', {
                    url: '/',
                    templateUrl: 'app/login/partials/homePage.html'

                })

        });
})();