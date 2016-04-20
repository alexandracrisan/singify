(function () {
    'use strict';

    angular.module('app', ['ui.router'])
        .config(function($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('/');

            $stateProvider
                .state('/', {
                    url: '/',
                    templateUrl: 'app/account/partials/home-page.html',
                    controller: 'MainCtrl as mainCtrl'
                })
                .state('/signup', {
                    url: '/signup',
                    templateUrl: 'app/account/partials/signup.html',
                    controller: 'SignupCtrl as signupCtrl'
                })
                .state('/signin', {
                    url: '/signin',
                    templateUrl: 'app/authentication/partials/signin.html',
                    controller: 'SigninCtrl as signinCtrl'
                })
                .state('/dashboard', {
                    url: '/dashboard',
                    templateUrl: 'app/user-dashboard/partials/user-dashboard.html'
                    //controller: 'SigninCtrl as signinCtrl'
                })

        });
})();