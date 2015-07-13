(function () {
  'use strict';

  /**
   * Register the edit controller as ApplicationQuickstartController
   */

  angular
    .module('austackApp.application.detail.quickstart')
    .controller('ApplicationQuickstartController', ApplicationQuickstartController);

  // add ApplicationQuickstartController dependencies to inject
  ApplicationQuickstartController.$inject = ['$state', '$http', 'application', 'Config'];

  /**
   * ApplicationQuickstartController constructor
   */
  function ApplicationQuickstartController($state, $http, application, Config) {
    var vm = this;

    // the current application to display
    vm.application = application;

    vm.download = {
      backend: {
        // https://github.com/arrking/austack-core/issues/109
        nodejs: function (appId) {
          console.log('download nodejs backend for ' + appId);
          $http({
              url: Config.API_URL + 'sampleapps/' + appId + '/nodejs',
              method: 'GET',
              responseType: 'arraybuffer',
              cache: false
            })
            .success(function (data, status) {
              saveAs(new Blob([data], {
                type: "application/octet-stream'"
              }), 'nodejs-backend.zip');
            })
            .error(function (err, status) {
              console.log(err);
            });
        }
      },
      client: {
        // https://github.com/arrking/austack-core/issues/110
        ionic: function (appId) {
          console.log('download ionic client for ' + appId);
        }
      }
    }
  }
})();
