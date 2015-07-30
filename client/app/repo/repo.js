(function () {
  'use strict';

  /**
   * Introduce the austackApp.repo module
   * and configure it.
   *
   * @requires ui.router
   * @requires ngResource
   * @requires austackApp.repo.main
   * @requires austackApp.repo.list
   * @requires austackApp.repo.create
   */
  angular
    .module('austackApp.repo', [
      'ngResource',
      'ui.router',
      'austackApp.repo.list',
      'austackApp.repo.detail',
      'austackApp.repo.edit',
      'austackApp.repo.create'
    ])
    .config(configRepoRoutes);

  // inject configRepoRoutes dependencies
  configRepoRoutes.$inject = ['$urlRouterProvider', '$stateProvider'];

  /**
   * Route configuration function configuring the passed $stateProvider.
   * Register the abstract repo state with the repo template
   * paired with the RepoController as 'index'.
   * The injectable 'repos' is resolved as a list of all repos
   * and can be injected in all sub controllers.
   *
   * @param {$stateProvider} $stateProvider - The state provider to configure
   */
  function configRepoRoutes($urlRouterProvider, $stateProvider) {
    // The repo state configuration
    var shapeState = {
      name: 'repo',
      parent: 'root',
      url: '/repos',
      abstract: true,
      resolve: {
        repos: resolveRepos
      },
      templateUrl: 'app/repo/repo.html',
      controller: 'RepoController',
      controllerAs: 'index'
    };

    $urlRouterProvider.when('/repos/', '/repos');
    $stateProvider.state(shapeState);
  }

  // inject resolveRepos dependencies
  resolveRepos.$inject = ['Repo'];

  /**
   * Resolve dependencies for the repo.list state
   *
   * @params {Repo} Repo - The service to query repos
   * @returns {Promise} A promise that, when fullfilled, returns an array of repos
   */
  function resolveRepos(Repo) {
    return Repo.query().$promise;
  }

})();
