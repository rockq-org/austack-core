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
    .module('austackApp.repo.service', ['austackApp.resource', 'austackApp.lodash'])
    .factory('Repo', Repo)
    .service('RepoService', RepoService);

  // add Repo dependencies to inject
  Repo.$inject = ['Resource', 'Config'];

  /* @ngInject */
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

  /* @ngInject */
  function RepoService(Repo, Config, $http, $q, _) {
    var apiURL = Config.API_URL + 'repos/';
    return {
      create: create,
      update: update,
      remove: remove,
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

    function remove(repoName, uid) {
      var d = $q.defer();

      $http.delete(apiURL + repoName + '/' + uid)
        .success(function (data, status, headers, config) {
          if (data.rc == '1') {
            return d.resolve(data);
          }

          return d.reject('delete failed');
        })
        .error(function (data, status, headers, config) {
          console.log(data, repoName);
          d.reject(data);
        });

      return d.promise;
    }

    function update(repoName, uid, itemData) {
      var d = $q.defer();

      $http.put(apiURL + repoName + '/' + uid, itemData)
        .success(function (data, status, headers, config) {
          if (data.rc == '1') {
            return d.resolve(data);
          }

          return d.reject('delete failed');
        })
        .error(function (data, status, headers, config) {
          console.log(data, repoName);
          d.reject(data);
        });

      return d.promise;
    }

    function getRepoData(repoName, query, callback) {
      var cb = callback || angular.noop;
      var d = $q.defer();
      var url = apiURL + repoName;

      var queryString = '';
      _.forOwn(query, function (value, key) {
        queryString += key + '=' + value + '&';
      });
      url += '?' + queryString;

      $http.get(url)
        .success(function (data, status, headers, config) {
          if (data) {
            cb(data);
            return d.resolve(data);
          }

          return d.reject('no data');
        })
        .error(function (data, status, headers, config) {
          console.log(data, repoName);
          d.reject(data);
        });

      return d.promise;
    }

  }
})();