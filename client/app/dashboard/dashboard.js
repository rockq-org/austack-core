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
      controllerAs: 'vm',
      ncyBreadcrumb: {
        label: 'Dashboard'
      }
    };

    $stateProvider.state(dashboardState);

    mainMenuProvider.addMenuItem({
      name: '仪表盘',
      state: dashboardState.name,
      order: 1
    });
  }

})();
