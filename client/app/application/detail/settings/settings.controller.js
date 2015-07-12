(function () {
  'use strict';

  /**
   * Register the edit controller as ApplicationSettingsController
   */

  angular
    .module('austackApp.application.detail.settings')
    .controller('ApplicationSettingsController', ApplicationSettingsController);

  // add ApplicationSettingsController dependencies to inject
  ApplicationSettingsController.$inject = ['$state', 'application'];

  /**
   * ApplicationSettingsController constructor
   */
  function ApplicationSettingsController($state, application) {
    var vm = this;

    // the current application to display
    vm.application = application;
  }
})();
