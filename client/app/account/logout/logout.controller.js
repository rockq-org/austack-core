/**
 * @ngdoc controller
 * @name austackApp.account.controller:AccountLogoutController
 * @description
 * Controller for the logout page
 */

(function () {
  'use strict';

  // register the controller as AccountLogoutController
  angular
    .module('austackApp.account.logout')
    .controller('AccountLogoutController', AccountLogoutController);


  /**
   * @ngdoc function
   * @name austackApp.account.provider:AccountLogoutController
   * @description
   * Provider of the {@link austackApp.account.controller:AccountLogoutController AccountLogoutController}
   *
   * @param {Service} Auth The Auth service to use
   * @param {Service} $location The location service to use
   * @returns {Service} {@link austackApp.account.controller:AccountLogoutController AccountLogoutController}
   */

  /** @ngInject */
  function AccountLogoutController(Auth) {
    Auth.logout();
  }

})();
