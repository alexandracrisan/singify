(function() {
    'use strict';

    angular
        .module('app')
        .factory('SigninService', SigninService);

    SigninService.$inject = ['$http', '$q'];

    function SigninService($http, $q) {
        var factory = {},
            base = 'http://localhost:3002/signin';

        factory.loginUser = function(userCredentials) {
            var deffer = $q.defer();
            var request = $http({
                method: 'POST',
                url: base,
                data: userCredentials
            });
            request
                .success(function(data, status, headers, config){
                    deffer.resolve(data);
                }).
                error(function(data, status, headers, config){
                    deffer.reject(status);
                    console.log(status);
                });
            return deffer.promise;
        };

        return factory;
    }
})();
