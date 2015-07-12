(function () {
  'use strict';

  // register the route config on the application
  angular
    .module('austackApp.layout', [
      'ui.router',
      'ncy-angular-breadcrumb',
      'austackApp.mainMenu'
    ])
    .config(configBreadcrumb)
    .config(configLayoutRoute);

  configBreadcrumb.$inject = ['$breadcrumbProvider'];

  function configBreadcrumb($breadcrumbProvider) {
    $breadcrumbProvider.setOptions({
      includeAbstract: false,
      templateUrl: 'app/layout/header/breadcrumb.html'
    });
  }

  configLayoutRoute.$inject = ['$stateProvider'];

  function configLayoutRoute($stateProvider) {
    var layoutState = {
      name: 'root',
      url: '',
      abstract: true,
      templateUrl: 'app/layout/layout.html',
      ncyBreadcrumb: {
        label: 'Home'
      }
    };

    $stateProvider.state(layoutState);
  }

})();
