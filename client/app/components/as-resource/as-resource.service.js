/**
 * @ngdoc overview
 * @name asResource
 * @requires lodash
 * @description
 * The austackApp.asResource module
 */

/**
 * @ngdoc service
 * @name resource.service:asResource
 * @description
 *
 */

(function () {
  'use strict';

  // register the service as asResource
  angular
    .module('austackApp.asResource', [
      'ngResource',
      'austackApp.lodash'
    ])
    .factory('asResource', asResource);


  /**
   * @ngdoc function
   * @name resource.provider:asResource
   * @description
   * Provider for the {@link resource.service:asResource Resource-service}
   *
   * @param {Service} $resource The resource service to use
   * @param {Service} _ The _ service to use
   * @returns {Function} asResource-factory
   */

  asResource.$inject = ['$resource', '_'];

  function asResource($resource, _) {
    // default $resource parameter configuration for MongoDB like id's
    var defaultParams = {
      id: '@_id'
    };

    // default $resource option configuration for RESTy PUT requests
    // create, read, update, delete, query
    var defaultMethods = {
      create: {
        method: 'POST'
      },
      read: {
        method: 'GET',
        params: {
          id: 'me'
        }
      },
      update: {
        method: 'PUT',
        isArray: false
      }
    };

    // public API
    return createasResource;

    /**
     * Create a resource with overwritten $save method
     *
     * @param url
     * @param params
     * @param methods
     * @returns {$resource}
     */
    function createasResource(url, params, methods) {
      var resource;

      params = _.defaults({}, params, defaultParams);
      methods = _.defaults({}, methods, defaultMethods);
      resource = $resource(url, params, methods);

      // overwrite $save to automatically call $create or $update
      resource.prototype.$save = function save() {
        if (!this._id) {
          return this.$create();
        }

        return this.$update();
      };

      return resource;
    }
  }

})();
