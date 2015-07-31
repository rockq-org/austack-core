(function () {
  'use strict';

  /**
   * Introduce the austackApp.repo.list.edit module
   * and configure it.
   *
   * @requires 'ui.router',
   * @requires 'ngMaterial',
   * @requires austackApp.mongooseError
   * @requires austackApp.repo.service
   */

  angular
    .module('austackApp.repo.edit', [
      'ui.router',
      'ngMaterial',
      'austackApp.mongooseError',
      'austackApp.repo.service'
    ])
    .config(configureRepoListEdit);

  // inject configRepoListEdit dependencies
  configureRepoListEdit.$inject = ['$stateProvider'];

  /**
   * Route configuration function configuring the passed $stateProvider.
   * Register the repo.list.edit state with the edit template
   * paired with the RepoEditController as 'edit' for the
   * 'detail@repo.list' view.
   * 'repo' is resolved as the repo with the id found in
   * the state parameters.
   *
   * @param {$stateProvider} $stateProvider - The state provider to configure
   */
  function configureRepoListEdit($stateProvider) {
    // The edit state configuration.
    var editState = {
      name: 'repo.edit',
      parent: 'repo',
      url: '/:id/edit',
      authenticate: true,
      role: 'admin',
      views: {
        '': {
          templateUrl: 'app/repo/edit/edit.html',
          controller: 'RepoEditController',
          controllerAs: 'edit',
          resolve: {
            repo: resolveRepoFromArray
          }
        }
      },
      ncyBreadcrumb: {
        label: '编辑 {{edit.repo.name}}',
        parent: 'repo.list'
      }
    };

    $stateProvider.state(editState);
  }

  // inject resolveRepoDetailRoute dependencies
  resolveRepoFromArray.$inject = ['repos', '$stateParams', '_'];

  /**
   * Resolve dependencies for the repo.list.edit state. Get the repo
   * from the injected Array of repos by using the '_id' property.
   *
   * @params {Array} repos - The array of repos
   * @params {Object} $stateParams - The $stateParams to read the repo id from
   * @params {Object} _ - The lodash service to find the requested repo
   * @returns {Object|null} The repo whose value of the _id property equals $stateParams._id
   */
  function resolveRepoFromArray(repos, $stateParams, _) {
    //	return Repo.get({id: $stateParams.id}).$promise;
    return _.find(repos, {
      '_id': $stateParams.id
    });
  }

})();
