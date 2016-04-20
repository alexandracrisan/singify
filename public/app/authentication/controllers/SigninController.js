(function() {
    'use strict';

    angular
        .module('app')
        .controller('SigninCtrl', SigninCtrl);

    SigninCtrl.$inject = ['SigninService', '$state'];

    function SigninCtrl(SigninService, $state) {
        this.current_user_ui = {};
        var self = this;

        this.signin = function() {
            SigninService.loginUser(self.current_user_ui).then(
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
