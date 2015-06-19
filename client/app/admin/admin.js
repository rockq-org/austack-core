(function () {
  'use strict';

  // register the route config on the application
  angular
    .module('austackApp.admin', [
      'ui.router',
      'austackApp.admin.main',
      'austackApp.admin.user',
      'austackApp.sidebar'
    ])
    .config(configAdminRoute);

  // inject configAdminRoute dependencies
  configAdminRoute.$inject = ['$urlRouterProvider', '$stateProvider'];

  // route config function configuring the passed $stateProvider
  function configAdminRoute($urlRouterProvider, $stateProvider) {
    var adminState = {
      name: 'root.admin',
      url: '/admin',
      templateUrl: 'app/admin/admin.html',
      controller: 'AdminController',
      controllerAs: 'vm'
    };

    //$urlRouterProvider.when('/admin', '/admin/');
    $stateProvider.state(adminState);
  }

})();
