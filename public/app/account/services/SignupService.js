(function() {
    'use strict';

    angular
        .module('app')
        .factory('SignupService', SignupService);

    SignupService.$inject = ['$q', 'UtilService'];

    function SignupService($q, UtilService) {
        var factory = {},
            base = UtilService.baseUrl + '/signup';

        factory.createUser = function(userCredentials) {
            var deffer = $q.defer();
            var request = UtilService.postEntity(base, userCredentials);

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
