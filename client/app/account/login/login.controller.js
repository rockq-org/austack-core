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
  AccountLoginController.$inject = ['$state', 'Auth', 'Toast'];
  /* @ngInject */
  function AccountLoginController($state, Auth, Toast) {
    var vm = this;

    vm.user = {};

    vm.login = login;

    function login(form) {
      if (form.$valid) {
        Auth.login({
          name: vm.user.name,
          password: vm.user.password
        }).then(function () {
          $state.go('dashboard');
        }).catch(function (err) {
          Toast.show('用户名或密码错误');
        });
      }
    }
  }

})();
