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

    vm.downloadBackend = downloadBackend;
    vm.downloadClient = downloadClient;

    function downloadBackend() {
      var appId = vm.application._id;
      $http({
          url: Config.API_URL + 'sampleapps/' + appId + '/nodejs',
          method: 'GET',
          responseType: 'arraybuffer',
          cache: false
        })
        .success(function (data, status) {
          saveAs(new Blob([data], {
            type: 'application/octet-stream'
          }), 'nodejs-backend.zip');
        })
        .error(function (err, status) {
          console.log(err);
        });
    }

    function downloadClient() {
      var appId = vm.application._id;
      $http({
          url: Config.API_URL + 'sampleapps/' + appId + '/ionic',
          method: 'GET',
          responseType: 'arraybuffer',
          cache: false
        })
        .success(function (data, status) {
          saveAs(new Blob([data], {
            type: 'application/octet-stream'
          }), 'ionic-client.zip');
        })
        .error(function (err, status) {
          console.log(err);
        });
    }
  }
})();
