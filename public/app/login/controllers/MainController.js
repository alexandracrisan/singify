(function() {
    'use strict';

    angular
        .module('appMy')
        .controller('MainCtrl', MainCtrl);

    MainCtrl.$inject = ['$scope', '$state'];

    function MainCtrl($scope, $state) {
        console.log(111);
    }
})();
