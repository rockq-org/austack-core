(function () {
  'use strict';

  /**
   * Register the edit controller as ApplicationQuickstartController
   */

  angular
    .module('austackApp.application.detail.quickstart')
    .controller('ApplicationQuickstartController', ApplicationQuickstartController);

  // add ApplicationQuickstartController dependencies to inject
  ApplicationQuickstartController.$inject = ['$state', 'application'];

  /**
   * ApplicationQuickstartController constructor
   */
  function ApplicationQuickstartController($state, application) {
    var vm = this;

    // the current application to display
    vm.application = application;
  }
})();
