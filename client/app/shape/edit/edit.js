(function () {
  'use strict';

  /**
   * Introduce the austackApp.shape.list.edit module
   * and configure it.
   *
   * @requires 'ui.router',
   * @requires 'ngMaterial',
   * @requires austackApp.mongooseError
   * @requires austackApp.shape.service
   */

  angular
    .module('austackApp.shape.edit', [
      'ui.router',
      'ngMaterial',
      'austackApp.mongooseError',
      'austackApp.shape.service'
    ])
    .config(configureShapeListEdit);

  // inject configShapeListEdit dependencies
  configureShapeListEdit.$inject = ['$stateProvider'];

  /**
   * Route configuration function configuring the passed $stateProvider.
   * Register the shape.list.edit state with the edit template
   * paired with the ShapeEditController as 'edit' for the
   * 'detail@shape.list' view.
   * 'shape' is resolved as the shape with the id found in
   * the state parameters.
   *
   * @param {$stateProvider} $stateProvider - The state provider to configure
   */
  function configureShapeListEdit($stateProvider) {
    // The edit state configuration.
    var editState = {
      name: 'shape.edit',
      parent: 'shape',
      url: '/:id/edit',
      authenticate: true,
      role: 'admin',
      views: {
        '': {
          templateUrl: 'app/shape/edit/edit.html',
          controller: 'ShapeEditController',
          controllerAs: 'edit',
          resolve: {
            shape: resolveShapeFromArray
          }
        }
      },
      ncyBreadcrumb: {
        label: '编辑 {{edit.shape.name}}',
        parent: 'shape.list'
      }
    };

    $stateProvider.state(editState);
  }

  // inject resolveShapeDetailRoute dependencies
  resolveShapeFromArray.$inject = ['shapes', '$stateParams', '_'];

  /**
   * Resolve dependencies for the shape.list.edit state. Get the shape
   * from the injected Array of shapes by using the '_id' property.
   *
   * @params {Array} shapes - The array of shapes
   * @params {Object} $stateParams - The $stateParams to read the shape id from
   * @params {Object} _ - The lodash service to find the requested shape
   * @returns {Object|null} The shape whose value of the _id property equals $stateParams._id
   */
  function resolveShapeFromArray(shapes, $stateParams, _) {
    //	return Shape.get({id: $stateParams.id}).$promise;
    return _.find(shapes, {
      '_id': $stateParams.id
    });
  }

})();
