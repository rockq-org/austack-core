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
      'austackApp.repo.service',
      'austackApp.shape.list',
      'austackApp.shape.detail',
      'austackApp.shape.edit',
      'austackApp.shape.create'
    ])
    .constant('shapeTypes', getShapeTypes())
    .config(configShapeRoutes);

  function getShapeTypes() {
    return [{
      name: 'String',
      text: '字符串'
    }, {
      name: 'Date',
      text: '日期'
    }, {
      name: 'Number',
      text: '数字'
    }, {
      name: 'Boolean',
      text: '布尔'
    }]
  }

  // inject configShapeRoutes dependencies
  configShapeRoutes.$inject = ['$urlRouterProvider', '$stateProvider', 'mainMenuProvider'];

  /**
   * Route configuration function configuring the passed $stateProvider.
   * Register the abstract shape state with the shape template
   * paired with the ShapeController as 'index'.
   * The injectable 'shapes' is resolved as a list of all shapes
   * and can be injected in all sub controllers.
   *
   * @param {$stateProvider} $stateProvider - The state provider to configure
   */
  function configShapeRoutes($urlRouterProvider, $stateProvider, mainMenuProvider) {
    // The shape state configuration

    var shapeState = {
      name: 'shape',
      parent: 'root',
      url: '/shapes',
      //abstract: true,
      ncyBreadcrumb: {
        label: '用户'
      },
      resolve: {
        shapes: resolveShapes
      },
      templateUrl: 'app/shape/shape.html',
      controller: 'ShapeController',
      controllerAs: 'index'
    };

    $urlRouterProvider.when('/shapes/', '/shapes');
    $stateProvider.state(shapeState);

    mainMenuProvider.addSubMenuItem('user.list', {
      name: '数据定义',
      state: shapeState.name,
      icon: 'action:ic_account_box_24px',
      order: 2
    });
  }

  // inject resolveShapes dependencies
  resolveShapes.$inject = ['Repo'];

  /**
   * Resolve dependencies for the shape.list state
   *
   * @params {Shape} Shape - The service to query shapes
   * @returns {Promise} A promise that, when fullfilled, returns an array of shapes
   */
  function resolveShapes(Repo) {
    return Repo.query().$promise;
  }

})();
