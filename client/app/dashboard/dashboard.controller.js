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
  function DashboardController(Config, $cookieStore, moment, statisticsData) {
    var vm = this;

    vm.statisticsData = statisticsData;
    var token = $cookieStore.get('token');
    var dataUrl = Config.API_URL + 'loginRecords/?access_token=' + token + '&start={{d:start}}&stop={{d:end}}';

    vm.heatMapConfig = {
      domain: 'month',
      domainLabelFormat: '%Y-%m',
      subDomain: 'x_day',
      data: dataUrl,
      start: new Date(2015, 7, 1),
      cellSize: 20,
      cellRadius: 3,
      cellPadding: 5,
      range: 4,
      domainMargin: 20,
      animationDuration: 800,
      domainDynamicDimension: false,
      afterLoadData: function (data) {
        var i, total, results = {};
        total = data.length;
        for (i = 0; i < total; i++) {
          results[moment(data[i].day, 'YYYY-MM-DD').unix()] = data[i].count;
        }
        return results;
      },
      previousSelector: '#prev-month',
      nextSelector: '#next-month',
      label: {
        position: 'bottom',
        width: 110
      },
      legend: [0, 40, 60, 80]
    };
  }

})();
