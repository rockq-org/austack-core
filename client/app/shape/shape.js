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
      'austackApp.shape.service',
      'austackApp.shape.list'
    ])
    .constant('shapeTypes', getShapeTypes())
    .config(configShapeRoutes);

  function getShapeTypes() {
    return [{
      name: 'String',
      text: 'String'
    }, {
      name: 'Date',
      text: 'Date'
    }, {
      name: 'Number',
      text: 'Number'
    }, {
      name: 'Boolean',
      text: 'Boolean'
    }];
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
        repos: resolveRepos
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
  resolveRepos.$inject = ['Repo'];

  /**
   * Resolve dependencies for the shape.list state
   *
   * @params {Shape} Shape - The service to query shapes
   * @returns {Promise} A promise that, when fullfilled, returns an array of shapes
   */
  function resolveRepos(Repo) {
    return Repo.query().$promise;
  }

})();
