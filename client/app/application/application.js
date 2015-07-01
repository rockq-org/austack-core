(function () {
  'use strict';

  /**
   * Introduce the austackApp.application module
   * and configure it.
   *
   * @requires ui.router
   * @requires ngResource
   * @requires austackApp.application.main
   * @requires austackApp.application.list
   * @requires austackApp.application.create
   */
  angular
    .module('austackApp.application', [
      'ngResource',
      'ui.router',
      'austackApp.application.list',
      'austackApp.application.detail',
      'austackApp.application.edit',
      'austackApp.application.create'
    ])
    .config(configApplicationRoutes);

  // inject configApplicationRoutes dependencies
  configApplicationRoutes.$inject = ['$urlRouterProvider', '$stateProvider'];

  /**
   * Route configuration function configuring the passed $stateProvider.
   * Register the abstract application state with the application template
   * paired with the ApplicationController as 'index'.
   * The injectable 'applications' is resolved as a list of all applications
   * and can be injected in all sub controllers.
   *
   * @param {$stateProvider} $stateProvider - The state provider to configure
   */
  function configApplicationRoutes($urlRouterProvider, $stateProvider) {
    // The application state configuration
    var applicationState = {
      name: 'application',
      parent: 'root',
      url: '/applications',
      abstract: true,
      resolve: {
        applications: resolveApplications
      },
      templateUrl: 'app/application/application.html',
      controller: 'ApplicationController',
      controllerAs: 'index'
    };

    //$urlRouterProvider.when('/application', '/application/');
    $stateProvider.state(applicationState);
  }

  // inject resolveApplications dependencies
  resolveApplications.$inject = ['Application'];

  /**
   * Resolve dependencies for the application.list state
   *
   * @params {Application} Application - The service to query applications
   * @returns {Promise} A promise that, when fullfilled, returns an array of applications
   */
  function resolveApplications(Application) {
    return Application.query().$promise;
  }

})();
