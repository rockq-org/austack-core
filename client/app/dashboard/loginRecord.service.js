(function () {
  'use strict';

  /**
   * Introduce the austackApp.loginRecord.service module.
   * Register the loginRecord resource as LoginRecord, register the
   * service as LoginRecordService.
   *
   * @requires {austackApp.resource}
   */
  angular
    .module('austackApp.loginRecord.service', ['austackApp.resource'])
    .factory('LoginRecord', LoginRecord)

  /* @ngInject */
  function LoginRecord($resource, Config, $q, $http) {
    // factory members
    var apiURL = Config.API_URL + 'loginRecords';
    // public API
    return {
      getStatisticsData: getStatisticsData
    };

    function getStatisticsData() {
      var deferred = $q.defer();

      $http.get(apiURL + '/statistics')
        .success(function (data) {
          deferred.resolve(data);
        }).error(function (err) {
          deferred.reject(err);
        });
      return deferred.promise;
    }
  }
})();