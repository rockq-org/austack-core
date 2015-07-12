(function () {
  'use strict';

  /**
   * Register the edit controller as ApplicationDetailController
   */

  angular
    .module('austackApp.application.detail')
    .controller('ApplicationDetailController', ApplicationDetailController);

  // add ApplicationDetailController dependencies to inject
  ApplicationDetailController.$inject = ['$state', 'application'];

  /**
   * ApplicationDetailController constructor
   */
  function ApplicationDetailController($state, application) {
    var vm = this;

    // the current application to display
    vm.application = application;
    vm.tabIdx = $state.current.data.tabIdx;
  }
})();
