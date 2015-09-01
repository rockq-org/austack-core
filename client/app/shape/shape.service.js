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

  /* @ngInject */
  function Shape(Resource, Config) {
    // factory members
    var apiURL = Config.API_URL + 'shapes';
    // public API
    return Resource(apiURL + '/:id/:controller', {}, {
      query: {
        isArray: false
      }
    });
  }

  /* @ngInject */
  function ShapeService(Shape, Config, $http, $q) {
    var apiURL = Config.API_URL + 'shapes/';

    return {
      update: update,
      getByRepoName: getByRepoName,
      remove: remove
    };

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

      return Shape.update({
          id: shape.name
        }, shape,
        function (shape) {
          return cb(shape);
        },
        function (err) {
          return cb(err);
        }).$promise;
    }

    function getByRepoName(repoName) {
      var d = $q.defer();
      $http.get(apiURL + repoName)
        .success(function (data, status, headers, config) {
          if (data.data && data.data.mSchema) {
            return d.resolve(data.data.mSchema);
          }

          return d.reject('no mSchema');
        })
        .error(function (data, status, headers, config) {
          console.log(data, repoName);
          d.reject(data);
        });

      return d.promise;
    }
  }
})();