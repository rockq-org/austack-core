(function () {
  'use strict';

  angular
    .module('austackApp.tenant', [
      'austackApp.asResource'
    ])
    .factory('Tenant', Tenant)
    .service('TenantService', TenantService);

  /* @ngInject */
  function Tenant(asResource, Config) {
    // factory members
    var apiURL = Config.API + 'tenant/:id/:controller';
    var methods = {
      verifyMobile: {
        method: 'PUT',
        params: {
          controller: 'verifyMobile'
        }
      },
      submitUserDetail: {
        method: 'PUT',
        params: {
          controller: 'submitUserDetail'
        }
      }
    };

    // now we have the standard create, read, update, delete, query methods
    return asResource(apiURL, {}, methods);
  }

  /* @ngInject */
  function TenantService($http, $log, Config, Tenant) {
    return {
      create: create,
      // update: update,
      // remove: remove,
      // getVerifyCode: getVerifyCode
    };

    function create(params, callback) {
      var cb = callback || angular.noop;

      return Tenant.create(
        params,
        function (tenant) {
          return cb(tenant);
        },
        function (err) {
          return cb(err);
        }).$promise;
    }
  }

})();
