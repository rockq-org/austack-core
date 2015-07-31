(function () {
  'use strict';

  /**
   * Introduce the austackApp.repo.list.detail submodule
   * and configure it.
   *
   * @requires ui.router
   * @requires angularMoment
   */

  angular
    .module('austackApp.repo.detail', [
      'ui.router',
      'angularMoment'
    ])
    .config(configureRepoDetail);

  // inject configRepoRoutes dependencies
  configureRepoDetail.$inject = ['$stateProvider', '$urlRouterProvider'];

  /**
   * Route configuration function configuring the passed $stateProvider.
   * Register the 'repo.detail' state with the detail template
   * paired with the RepoDetailController as 'detail' for the
   * 'sidenav' sub view.
   * 'repo' is resolved as the repo with the id found in
   * the state parameters.
   *
   * @param {$stateProvider} $stateProvider - The state provider to configure
   */
  function configureRepoDetail($stateProvider, $urlRouterProvider) {
    // The detail state configuration
    var detailState = {
      name: 'repo.detail',
      parent: 'repo',
      url: '/:id',
      authenticate: true,
      role: 'admin',
      views: {
        '': {
          templateUrl: 'app/repo/detail/detail.html',
          controller: 'RepoDetailController',
          controllerAs: 'detail'
        }
      },
      ncyBreadcrumb: {
        label: '{{detail.repo.name}}',
        parent: 'repo.list'
      },
      resolve: {
        repo: resolveRepoFromArray
      }
    };

    $urlRouterProvider.when('/repos/:id', '/repos/:id/quickstart');
    $stateProvider.state(detailState);
  }

  // inject resolveRepoFromArray dependencies
  resolveRepoFromArray.$inject = ['repos', '$stateParams', '_'];

  /**
   * Resolve dependencies for the repo.detail state
   *
   * @params {Array} repos - The array of repos
   * @params {Object} $stateParams - The $stateParams to read the repo id from
   * @returns {Object|null} The repo whose value of the _id property equals $stateParams._id
   */
  function resolveRepoFromArray(repos, $stateParams, _) {
    //console.log(detail.repo.name);
    return _.find(repos.data, {
      '_id': $stateParams.id
    });
  }

})();
