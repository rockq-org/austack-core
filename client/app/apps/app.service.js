(function () {
  'use strict';

  /**
   * Introduce the austackApp.app.service module.
   * Register the app resource as App, register the
   * service as AppService.
   *
   * @requires {austackApp.resource}
   */
  angular
    .module('austackApp.app.service', ['austackApp.resource'])
    .factory('App', App)
    .service('AppService', AppService);

  // add App dependencies to inject
  App.$inject = ['Resource'];

  /**
   * App resource constructor
   */
  function App($resource) {
    // factory members
    var apiURL = '/api/apps';
    // public API
    return $resource(apiURL + '/:id/:controller');
  }

  // add AppService dependencies to inject
  AppService.$inject = ['App'];

  /**
   * AppService constructor
   * AngularJS will instantiate a singleton by calling "new" on this function
   *
   * @param {$resource} App The resource provided by austackApp.app.resource
   * @returns {Object} The service definition for the AppService service
   */
  function AppService(App) {

    return {
      create: create,
      update: update,
      remove: remove
    };

    /**
     * Save a new app
     *
     * @param  {Object}   app - appData
     * @param  {Function} callback - optional
     * @return {Promise}
     */
    function create(app, callback) {
      var cb = callback || angular.noop;

      return App.create(app,
        function (app) {
          return cb(app);
        },
        function (err) {
          return cb(err);
        }).$promise;
    }

    /**
     * Remove a app
     *
     * @param  {Object}   app - appData
     * @param  {Function} callback - optional
     * @return {Promise}
     */
    function remove(app, callback) {
      var cb = callback || angular.noop;

      return App.remove({
          id: app._id
        },
        function (app) {
          return cb(app);
        },
        function (err) {
          return cb(err);
        }).$promise;
    }

    /**
     * Create a new app
     *
     * @param  {Object}   app - appData
     * @param  {Function} callback - optional
     * @return {Promise}
     */
    function update(app, callback) {
      var cb = callback || angular.noop;

      return App.update(app,
        function (app) {
          return cb(app);
        },
        function (err) {
          return cb(err);
        }).$promise;
    }
  }
})();
