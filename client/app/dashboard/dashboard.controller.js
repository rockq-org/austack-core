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

    vm.heatMapConfig = {
      domain: 'month',
      subDomain: 'x_day',
      data: 'datas-years.json',
      start: new Date(2000, 0, 5),
      cellSize: 15,
      cellRadius: 3,
      cellPadding: 5,
      range: 5,
      domainMargin: 20,
      animationDuration: 800,
      domainDynamicDimension: false,
      previousSelector: '#example-h-PreviousDomain-selector',
      nextSelector: '#example-h-NextDomain-selector',
      label: {
        position: 'bottom',
        width: 110
      },
      legend: [20, 40, 60, 80]
    };
  }

})();
