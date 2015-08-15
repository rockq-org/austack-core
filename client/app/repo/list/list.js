(function () {
  'use strict';

  /**
   * Introduce the austackApp.repo.list module
   * and configure it.
   * @requires ui.router
   * @requires ngMaterial
   * @requires austackApp.socket
   * @requires austackApp.mainMenu,
   * @requires austackApp.toggleComponent,
   * @requires austackApp.repo.list.detail
   * @requires austackApp.repo.list.edit
   * @requires austackApp.repo.list.items
   */

  angular
    .module('austackApp.repo.list', [
      'ngMaterial',
      'ui.router',
      'md.data.table',
      'austackApp.socket',
      'austackApp.application.service',
      'austackApp.listImage',
      'austackApp.shape.service',
      'austackApp.mainMenu'
    ])
    .config(configRepoListRoutes);

  // inject configRepoListRoutes dependencies
  configRepoListRoutes.$inject = ['$stateProvider', 'mainMenuProvider'];

  /**
   * Route configuration function configuring the passed $stateProvider.
   * Register the repo.list state with the list template fpr the
   * 'main' view paired with the RepoListController as 'list'.
   *
   * @param {$stateProvider} $stateProvider - The state provider to configure
   */
  function configRepoListRoutes($stateProvider, mainMenuProvider) {
    // The list state configuration
    var listState = {
      name: 'repo.list',
      parent: 'repo',
      url: '/:repoName',
      ncyBreadcrumb: {
        label: '数据列表'
      },
      authenticate: true,
      role: 'admin',
      resolve: {
        /* @ngInject */
        repoName: function (repos) {
          var repoName = repos.data[0];
          return repoName;
        },
        /* @ngInject */
        repoSchema: function (ShapeService, repoName) {
          return ShapeService.getByRepoName(repoName);
        },
        /* @ngInject */
        query: function () {
          return {
            sortby: 'mobile',
            limit: 10,
            page: 1
          };
        },
        /* @ngInject */
        repoData: function (RepoService, repoName, query) {
          return RepoService.getRepoData(repoName, query);
        }
      },
      views: {
        '': {
          templateUrl: 'app/repo/list/list.html',
          controller: 'RepoListController',
          controllerAs: 'list'
        }
      }
    };

    $stateProvider.state(listState);
  }

})();
