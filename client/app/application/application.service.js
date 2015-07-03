(function () {
  'use strict';

  /**
   * Introduce the austackApp.application.service module.
   * Register the application resource as Application, register the
   * service as ApplicationService.
   *
   * @requires {austackApp.resource}
   */
  angular
    .module('austackApp.application.service', ['austackApp.resource'])
    .factory('Application', Application)
    .service('ApplicationService', ApplicationService);

  // add Application dependencies to inject
  Application.$inject = ['Resource', 'Config'];

  /**
   * Application resource constructor
   */
  function Application($resource, Config) {
    // factory members
    var apiURL = Config.API_URL + 'applications';
    // public API
    return $resource(apiURL + '/:id/:controller');
  }

  // add ApplicationService dependencies to inject
  ApplicationService.$inject = ['Application'];

  /**
   * ApplicationService constructor
   * AngularJS will instantiate a singleton by calling "new" on this function
   *
   * @param {$resource} Application The resource provided by austackApp.application.resource
   * @returns {Object} The service definition for the ApplicationService service
   */
  function ApplicationService(Application) {

    return {
      create: create,
      update: update,
      remove: remove
    };

    /**
     * Save a new application
     *
     * @param  {Object}   application - applicationData
     * @param  {Function} callback - optional
     * @return {Promise}
     */
    function create(application, callback) {
      var cb = callback || angular.noop;

      return Application.create(application,
        function (application) {
          return cb(application);
        },
        function (err) {
          return cb(err);
        }).$promise;
    }

    /**
     * Remove a application
     *
     * @param  {Object}   application - applicationData
     * @param  {Function} callback - optional
     * @return {Promise}
     */
    function remove(application, callback) {
      var cb = callback || angular.noop;

      return Application.remove({
          id: application._id
        },
        function (application) {
          return cb(application);
        },
        function (err) {
          return cb(err);
        }).$promise;
    }

    /**
     * Create a new application
     *
     * @param  {Object}   application - applicationData
     * @param  {Function} callback - optional
     * @return {Promise}
     */
    function update(application, callback) {
      var cb = callback || angular.noop;

      return Application.update(application,
        function (application) {
          return cb(application);
        },
        function (err) {
          return cb(err);
        }).$promise;
    }
  }
})();
