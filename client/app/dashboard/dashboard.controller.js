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

  /* @ngInject */
  function DashboardController(Config, $cookieStore) {
    var vm = this;
    var token = $cookieStore.get('token');
    console.log(token);
    var dataUrl = Config.API_URL + "loginRecords/?access_token=" + token + "&start={{d:start}}&stop={{d:end}}";

    vm.heatMapConfig = {
      domain: 'month',
      subDomain: 'x_day',
      data: dataUrl,
      start: new Date(2015, 0, 1),
      cellSize: 20,
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