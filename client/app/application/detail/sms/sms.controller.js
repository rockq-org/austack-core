(function () {
  'use strict';

  /**
   * Register the edit controller as ApplicationSMSController
   */

  angular
    .module('austackApp.application.detail.sms')
    .controller('ApplicationSMSController', ApplicationSMSController);

  // add ApplicationSMSController dependencies to inject
  ApplicationSMSController.$inject = ['$state', 'application'];

  /**
   * ApplicationSMSController constructor
   */
  function ApplicationSMSController($state, application) {
    var vm = this;

    // the current application to display
    vm.application = application;
  }
})();
