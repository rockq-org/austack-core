(function () {
  'use strict';

  // register the route config on the application
  angular
    .module('austackApp.dashboard', ['ui.router', 'austackApp.layout'])
    .config(configMainRoute);

  // inject configMainRoute dependencies
  configMainRoute.$inject = ['$stateProvider', 'sidebarProvider'];

  // route config function configuring the passed $stateProvider
  function configMainRoute($stateProvider, sidebarProvider) {
    var dashboardState = {
      name: 'dashboard',
      parent: 'root',
      url: '/',
      authenticate: true,
      templateUrl: 'app/dashboard/dashboard.html',
      controller: 'DashboardController',
      controllerAs: 'vm'
    };

    $stateProvider.state(dashboardState);

    sidebarProvider.addMenuItem({
      name: 'Dashboard',
      state: dashboardState.name,
      order: 1
    });
  }

})();
