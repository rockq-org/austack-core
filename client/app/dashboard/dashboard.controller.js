/**
 * @ngdoc controller
 * @name austackApp.main.controller:MainController
 * @description
 * Controls mainly nothing currently
 */

(function () {
  'use strict';

  // register the controller as MainController
  angular
    .module('austackApp.dashboard')
    .controller('DashboardController', DashboardController);

  /**
   * @ngdoc function
   * @name austackApp.main.provider:MainController
   * @description
   * Provider of the {@link austackApp.main.controller:MainController MainController}
   *
   * @param {Service} $scope The scope service to use
   * @param {Service} $http The http service to use
   */

  // MainController.$inject = [];

  function DashboardController() {
    var vm = this;
  }

})();
