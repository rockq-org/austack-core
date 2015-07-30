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
      'austackApp.socket',
      'austackApp.listImage',
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
      url: '',
      ncyBreadcrumb: {
        label: '数据定义'
      },
      authenticate: true,
      role: 'admin',
      views: {
        '': {
          templateUrl: 'app/repo/list/list.html',
          controller: 'RepoListController',
          controllerAs: 'list'
        }
      }
    };

    $stateProvider.state(listState);

    mainMenuProvider.addSubMenuItem('user.list', {
      name: '数据定义',
      state: listState.name,
      icon: 'action:ic_account_box_24px',
      order: 1
    });
  }

})();
