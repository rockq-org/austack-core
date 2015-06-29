(function () {
  'use strict';

  // register the route config on the application
  angular
    .module('austackApp.admin', [
      'ui.router',
      'austackApp.admin.main',
      'austackApp.admin.user',
      'austackApp.mainMenu'
    ])
    .config(configAdminRoute);

  // inject configAdminRoute dependencies
  configAdminRoute.$inject = ['$urlRouterProvider', '$stateProvider'];

  // route config function configuring the passed $stateProvider
  function configAdminRoute($urlRouterProvider, $stateProvider) {
    var adminState = {
      name: 'admin',
      parent: 'root',
      url: '/admin',
      abstract: true,
      templateUrl: 'app/admin/admin.html',
      controller: 'AdminController',
      controllerAs: 'vm',
      ncyBreadcrumb: {
        label: 'Admin'
      }
    };

    //$urlRouterProvider.when('/admin', '/admin/');
    $stateProvider.state(adminState);
  }

})();
