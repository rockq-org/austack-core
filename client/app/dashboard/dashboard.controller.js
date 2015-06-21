/**
 * @ngdoc controller
 * @name austackApp.main.controller:DashboardController
 * @description
 * Controls mainly nothing currently
 */

(function () {
  'use strict';

  // register the controller as DashboardController
  angular
    .module('austackApp.dashboard')
    .controller('DashboardController', DashboardController);

  /**
   * @ngdoc function
   * @name austackApp.main.provider:DashboardController
   * @description
   * Provider of the {@link austackApp.main.controller:DashboardController DashboardController}
   *
   * @param {Service} $scope The scope service to use
   * @param {Service} $http The http service to use
   */

  DashboardController.$inject = [];

  function DashboardController() {
    var vm = this;
  }

})();
