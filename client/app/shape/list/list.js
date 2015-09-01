(function () {
  'use strict';

  /**
   * Introduce the austackApp.shape.list module
   * and configure it.
   * @requires ui.router
   * @requires ngMaterial
   * @requires austackApp.socket
   * @requires austackApp.mainMenu,
   * @requires austackApp.toggleComponent,
   * @requires austackApp.shape.list.detail
   * @requires austackApp.shape.list.edit
   * @requires austackApp.shape.list.items
   */

  angular
    .module('austackApp.shape.list', [
      'ngMaterial',
      'ui.router',
      'dndLists',
      'austackApp.socket',
      'austackApp.listImage',
      'austackApp.mainMenu'
    ])
    .config(configShapeListRoutes);

  // inject configShapeListRoutes dependencies
  configShapeListRoutes.$inject = ['$stateProvider', 'mainMenuProvider'];

  /**
   * Route configuration function configuring the passed $stateProvider.
   * Register the shape.list state with the list template fpr the
   * 'main' view paired with the ShapeListController as 'list'.
   *
   * @param {$stateProvider} $stateProvider - The state provider to configure
   */
  function configShapeListRoutes($stateProvider, mainMenuProvider) {
    // The list state configuration
    var listState = {
      name: 'shape.list',
      parent: 'shape',
      url: '/:repoName',
      ncyBreadcrumb: {
        label: '数据定义'
      },
      authenticate: true,
      role: 'admin',
      resolve: {
        shape: resolveShape
      },
      views: {
        '': {
          templateUrl: 'app/shape/list/list.html',
          controller: 'ShapeListController',
          controllerAs: 'list'
        }
      }
    };

    $stateProvider.state(listState);
  }

  // inject resolveShapeFromArray dependencies
  resolveShape.$inject = ['Shape', '$stateParams'];

  /**
   * Resolve dependencies for the shape.detail state
   *
   * @params {Array} shapes - The array of shapes
   * @params {Object} $stateParams - The $stateParams to read the shape id from
   * @returns {Object|null} The shape whose value of the _id property equals $stateParams._id
   */
  function resolveShape(Shape, $stateParams) {
    //return 'asd';
    //console.log($stateParams);
    return Shape.query({
      id: $stateParams.repoName,
      isArray: false
    }).$promise;
  }

})();
