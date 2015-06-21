(function () {
  'use strict';

  // register the controller as SignupCtrl
  angular
    .module('austackApp.account')
    .controller('SignupCtrl', SignupCtrl);

  // add SignupCtrl dependencies to inject
  SignupCtrl.$inject = ['Auth', '$location'];

  /**
   * SignupCtrl constructor
   */
  function SignupCtrl(Auth, $location) {
    var vm = this;

    // view model bindings
    vm.title = 'signup';
    vm.signup = signup;

    // view model implementations
    function signup(form) {
      if (!form.$valid) {
        return;
      }

      Auth.signup({
        customerId: vm.user.customerId,
        name: vm.user.name,
        password: vm.user.password
      }).then(function () {
        // Signed up, redirect to login
        $location.path('/login');
      }).catch(function (err) {
        vm.error = err;
      });
    }
  }

})();