(function () {
  'use strict';

  /**
   * Introduce the austackApp.shape.service module.
   * Register the shape resource as Shape, register the
   * service as ShapeService.
   *
   * @requires {austackApp.resource}
   */
  angular
    .module('austackApp.shape.service', ['austackApp.resource'])
    .factory('Shape', Shape)
    .service('ShapeService', ShapeService);

  // add Shape dependencies to inject
  Shape.$inject = ['Resource', 'Config'];

  /**
   * Shape resource constructor
   */
  function Shape($resource, Config) {
    // factory members
    var apiURL = Config.API_URL + 'shapes';
    // public API
    return $resource(apiURL + '/:id/:controller', {}, {
      query: {
        isArray: false
      }
    });
  }

  // add ShapeService dependencies to inject
  ShapeService.$inject = ['Shape'];

  /**
   * ShapeService constructor
   * AngularJS will instantiate a singleton by calling "new" on this function
   *
   * @param {$resource} Shape The resource provided by austackApp.shape.resource
   * @returns {Object} The service definition for the ShapeService service
   */
  function ShapeService(Shape) {

    return {
      create: create,
      update: update,
      remove: remove,
      refreshSecret: refreshSecret
    };

    /**
     * Save a new shape
     *
     * @param  {Object}   shape - shapeData
     * @param  {Function} callback - optional
     * @return {Promise}
     */
    function create(shape, callback) {
      var cb = callback || angular.noop;

      return Shape.create(shape,
        function (shape) {
          return cb(shape);
        },
        function (err) {
          return cb(err);
        }).$promise;
    }

    /**
     * Remove a shape
     *
     * @param  {Object}   shape - shapeData
     * @param  {Function} callback - optional
     * @return {Promise}
     */
    function remove(shape, callback) {
      var cb = callback || angular.noop;

      return Shape.remove({
          id: shape._id
        },
        function (shape) {
          return cb(shape);
        },
        function (err) {
          return cb(err);
        }).$promise;
    }

    /**
     * Create a new shape
     *
     * @param  {Object}   shape - shapeData
     * @param  {Function} callback - optional
     * @return {Promise}
     */
    function update(shape, callback) {
      var cb = callback || angular.noop;

      return Shape.update(shape,
        function (shape) {
          return cb(shape);
        },
        function (err) {
          return cb(err);
        }).$promise;
    }

    /**
     * Refresh Secret Token
     *
     * @param  {Object}   shape - shapeData
     * @param  {Function} callback - optional
     * @return {Promise}
     */
    function refreshSecret(shape, callback) {
      var cb = callback || angular.noop;

      return Shape.get({
          id: shape._id,
          controller: 'refresh-secret-token'
        },
        function (shape) {
          return cb(shape);
        },
        function (err) {
          return cb(err);
        }).$promise;
    }
  }
})();
