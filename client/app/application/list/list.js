(function () {
  'use strict';

  /**
   * Introduce the austackApp.application.list module
   * and configure it.
   * @requires ui.router
   * @requires ngMaterial
   * @requires austackApp.socket
   * @requires austackApp.mainMenu,
   * @requires austackApp.toggleComponent,
   * @requires austackApp.application.list.detail
   * @requires austackApp.application.list.edit
   * @requires austackApp.application.list.items
   */

  angular
    .module('austackApp.application.list', [
      'ngMaterial',
      'ui.router',
      'austackApp.socket',
      'austackApp.listImage',
      'austackApp.geopattern',
      'austackApp.mainMenu'
    ])
    .config(configApplicationListRoutes);

  // inject configApplicationListRoutes dependencies
  configApplicationListRoutes.$inject = ['$stateProvider', 'mainMenuProvider'];

  /**
   * Route configuration function configuring the passed $stateProvider.
   * Register the application.list state with the list template fpr the
   * 'main' view paired with the ApplicationListController as 'list'.
   *
   * @param {$stateProvider} $stateProvider - The state provider to configure
   */
  function configApplicationListRoutes($stateProvider, mainMenuProvider) {
    // The list state configuration
    var listState = {
      name: 'application.list',
      parent: 'application',
      url: '',
      ncyBreadcrumb: {
        label: '应用'
      },
      authenticate: true,
      role: 'admin',
      views: {
        '': {
          templateUrl: 'app/application/list/list.html',
          controller: 'ApplicationListController',
          controllerAs: 'list'
        }
      }
    };

    $stateProvider.state(listState);

    mainMenuProvider.addMenuItem({
      name: '应用',
      state: listState.name,
      icon: 'action:ic_view_list_24px',
      order: 2
    });
  }

})();
