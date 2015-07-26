(function () {
  'use strict';

  /**
   * Introduce the austackApp.shape.list.detail submodule
   * and configure it.
   *
   * @requires ui.router
   * @requires angularMoment
   */

  angular
    .module('austackApp.shape.detail', [
      'ui.router',
      'angularMoment'
    ])
    .config(configureShapeDetail);

  // inject configShapeRoutes dependencies
  configureShapeDetail.$inject = ['$stateProvider', '$urlRouterProvider'];

  /**
   * Route configuration function configuring the passed $stateProvider.
   * Register the 'shape.detail' state with the detail template
   * paired with the ShapeDetailController as 'detail' for the
   * 'sidenav' sub view.
   * 'shape' is resolved as the shape with the id found in
   * the state parameters.
   *
   * @param {$stateProvider} $stateProvider - The state provider to configure
   */
  function configureShapeDetail($stateProvider, $urlRouterProvider) {
    // The detail state configuration
    var detailState = {
      name: 'shape.detail',
      parent: 'shape',
      url: '/:id',
      authenticate: true,
      role: 'admin',
      views: {
        '': {
          templateUrl: 'app/shape/detail/detail.html',
          controller: 'ShapeDetailController',
          controllerAs: 'detail'
        }
      },
      ncyBreadcrumb: {
        label: '{{detail.shape.name}}',
        parent: 'shape.list'
      },
      resolve: {
        shape: resolveShapeFromArray
      }
    };

    $urlRouterProvider.when('/shapes/:id', '/shapes/:id/quickstart');
    $stateProvider.state(detailState);
  }

  // inject resolveShapeFromArray dependencies
  resolveShapeFromArray.$inject = ['shapes', '$stateParams', '_'];

  /**
   * Resolve dependencies for the shape.detail state
   *
   * @params {Array} shapes - The array of shapes
   * @params {Object} $stateParams - The $stateParams to read the shape id from
   * @returns {Object|null} The shape whose value of the _id property equals $stateParams._id
   */
  function resolveShapeFromArray(shapes, $stateParams, _) {
    //console.log(detail.shape.name);
    return _.find(shapes.data, {
      '_id': $stateParams.id
    });
  }

})();
