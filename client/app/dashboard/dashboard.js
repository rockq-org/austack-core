(function () {
  'use strict';

  // register the route config on the application
  angular
    .module('austackApp.dashboard', ['ui.router', 'austackApp.layout'])
    .config(configMainRoute);

  // inject configMainRoute dependencies
  configMainRoute.$inject = ['$stateProvider', 'mainMenuProvider'];

  // route config function configuring the passed $stateProvider
  function configMainRoute($stateProvider, mainMenuProvider) {
    var dashboardState = {
      name: 'dashboard',
      parent: 'root',
      url: '/',
      authenticate: true,
      templateUrl: 'app/dashboard/dashboard.html',
      controller: 'DashboardController',
      controllerAs: 'dashboard',
      resolve: {
        statisticsData: function () {
          return {
            allUserCount: 52,
            currentMonthActively: 40,
            currentWeekLoginTimes: 298,
            currentWeekNewUser: 30
          };
        }
      },
      ncyBreadcrumb: {
        label: '仪表盘'
      }
    };

    $stateProvider.state(dashboardState);

    mainMenuProvider.addMenuItem({
      name: '仪表盘',
      state: dashboardState.name,
      icon: 'action:ic_dashboard_24px',
      order: 1
    });
  }

})();