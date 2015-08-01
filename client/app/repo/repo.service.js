(function () {
  'use strict';

  /**
   * Introduce the austackApp.repo.service module.
   * Register the repo resource as Repo, register the
   * service as RepoService.
   *
   * @requires {austackApp.resource}
   */
  angular
    .module('austackApp.repo.service', ['austackApp.resource'])
    .factory('Repo', Repo)
    .service('RepoService', RepoService);

  // add Repo dependencies to inject
  Repo.$inject = ['Resource', 'Config'];

  /**
   * Repo resource constructor
   */
  function Repo($resource, Config) {
    // factory members
    var apiURL = Config.API_URL + 'repos';
    // public API
    return $resource(apiURL + '/:id/:controller', {}, {
      query: {
        isArray: false
      }
    });
  }

  // add RepoService dependencies to inject
  RepoService.$inject = ['Repo'];

  /**
   * RepoService constructor
   * AngularJS will instantiate a singleton by calling "new" on this function
   *
   * @param {$resource} Repo The resource provided by austackApp.repo.resource
   * @returns {Object} The service definition for the RepoService service
   */
  function RepoService(Repo) {

    return {
      create: create,
      update: update,
      remove: remove,
      getRepoSchema: getRepoSchema,
      getRepoData: getRepoData
    };

    /**
     * Save a new repo
     *
     * @param  {Object}   repo - shapeData
     * @param  {Function} callback - optional
     * @return {Promise}
     */
    function create(repo, callback) {
      var cb = callback || angular.noop;

      return Repo.create(repo,
        function (repo) {
          return cb(repo);
        },
        function (err) {
          return cb(err);
        }).$promise;
    }

    /**
     * Remove a repo
     *
     * @param  {Object}   repo - shapeData
     * @param  {Function} callback - optional
     * @return {Promise}
     */
    function remove(repo, callback) {
      var cb = callback || angular.noop;

      return Repo.remove({
          id: repo._id
        },
        function (repo) {
          return cb(repo);
        },
        function (err) {
          return cb(err);
        }).$promise;
    }

    /**
     * Create a new repo
     *
     * @param  {Object}   repo - shapeData
     * @param  {Function} callback - optional
     * @return {Promise}
     */
    function update(repo, callback) {
      var cb = callback || angular.noop;

      return Repo.update(repo,
        function (repo) {
          return cb(repo);
        },
        function (err) {
          return cb(err);
        }).$promise;
    }

    function getRepoSchema(repoName) {
      console.log(repoName);
    }

    function getRepoData(repoName) {
      console.log(repoName);

    }

  }
})();