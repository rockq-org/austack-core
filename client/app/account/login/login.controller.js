/**
 * @ngdoc controller
 * @name austackApp.account.controller:AccountLoginController
 * @description
 * Controller for the login page
 */

(function () {
  'use strict';

  // register the controller as AccountLoginController
  angular
    .module('austackApp.account')
    .controller('AccountLoginController', AccountLoginController);


  /**
   * @ngdoc function
   * @name austackApp.account.provider:AccountLoginController
   * @description
   * Provider of the {@link austackApp.account.controller:AccountLoginController AccountLoginController}
   *
   * @param {Service} Auth The Auth service to use
   * @param {Service} $state The state service to use
   * @returns {Service} {@link austackApp.account.controller:AccountLoginController AccountLoginController}
   */

  /* @ngInject */
  function AccountLoginController($state, Auth) {
    var vm = this;

    // view model bindings
    /**
     * @ngdoc property
     * @name user
     * @propertyOf austackApp.account.controller:AccountLoginController
     * @description
     * The user data to use as login
     *
     * @returns {User} The user data
     */
    vm.user = {};
    vm.user = {
      name: '18959264502',
      password: 'laijinyue'
    };

    /**
     * @ngdoc property
     * @name error
     * @propertyOf austackApp.account.controller:AccountLoginController
     * @description
     * Error flag
     * @returns {Boolean} True if there is an error
     */
    vm.error = false;

    // Login function (documented below)
    vm.login = login;

    /**
     * @ngdoc function
     * @name login
     * @methodOf austackApp.account.controller:AccountLoginController
     * @description
     * Function to use as submit for the login form
     * @param {form} form The form to fetch the data from
     */
    function login(form) {
      if (form.$valid) {
        Auth.login({
          customerId: vm.user.customerId,
          name: vm.user.name,
          password: vm.user.password
        }).then(function () {
          // Logged in, redirect to home
          // $location.path('/');
          $state.go('dashboard');
        }).catch(function (err) {
          vm.error = err;
        });
      }
    }
  }

})();
