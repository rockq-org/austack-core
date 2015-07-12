(function () {
  'use strict';

  /**
   * Register the edit controller as ApplicationLoginpageController
   */

  angular
    .module('austackApp.application.detail.loginpage')
    .controller('ApplicationLoginpageController', ApplicationLoginpageController);

  // add ApplicationLoginpageController dependencies to inject
  ApplicationLoginpageController.$inject = ['$state', 'application'];

  /**
   * ApplicationLoginpageController constructor
   */
  function ApplicationLoginpageController($state, application) {
    var vm = this;

    // the current application to display
    vm.application = application;
    vm.tabIdx = 2;
  }
})();
