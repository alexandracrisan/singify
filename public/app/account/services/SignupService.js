(function() {
    'use strict';

    angular
        .module('app')
        .factory('SignupService', SignupService);

    SignupService.$inject = ['$http', '$q'];

    function SignupService($http, $q) {
        var factory = {},
            base = 'http://localhost:3002/signup';

        factory.createUser = function(userCredentials) {
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
