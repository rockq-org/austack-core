(function () {
  'use strict';

  // register the route config on the application
  angular
    .module('austackApp.layout', [
      'ui.router',
      'austackApp.layout.breadcrumb'
    ])
    .config(configLayoutRoute);

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
