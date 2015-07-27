(function () {
  'use strict';

  /**
   * Introduce the austackApp.shape module
   * and configure it.
   *
   * @requires ui.router
   * @requires ngResource
   * @requires austackApp.shape.main
   * @requires austackApp.shape.list
   * @requires austackApp.shape.create
   */
  angular
    .module('austackApp.shape', [
      'ngResource',
      'ui.router',
      'austackApp.shape.list',
      'austackApp.shape.detail',
      'austackApp.shape.edit',
      'austackApp.shape.create'
    ])
    .config(configShapeRoutes);

  // inject configShapeRoutes dependencies
  configShapeRoutes.$inject = ['$urlRouterProvider', '$stateProvider'];

  /**
   * Route configuration function configuring the passed $stateProvider.
   * Register the abstract shape state with the shape template
   * paired with the ShapeController as 'index'.
   * The injectable 'shapes' is resolved as a list of all shapes
   * and can be injected in all sub controllers.
   *
   * @param {$stateProvider} $stateProvider - The state provider to configure
   */
  function configShapeRoutes($urlRouterProvider, $stateProvider) {
    // The shape state configuration
    var shapeState = {
      name: 'shape',
      parent: 'root',
      url: '/shapes',
      abstract: true,
      resolve: {
        shapes: resolveShapes
      },
      templateUrl: 'app/shape/shape.html',
      controller: 'ShapeController',
      controllerAs: 'index'
    };

    $urlRouterProvider.when('/shapes/', '/shapes');
    $stateProvider.state(shapeState);
  }

  // inject resolveShapes dependencies
  resolveShapes.$inject = ['Shape'];

  /**
   * Resolve dependencies for the shape.list state
   *
   * @params {Shape} Shape - The service to query shapes
   * @returns {Promise} A promise that, when fullfilled, returns an array of shapes
   */
  function resolveShapes(Shape) {
    return Shape.query().$promise;
  }

})();
