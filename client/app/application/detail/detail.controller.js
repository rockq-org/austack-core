(function () {
  'use strict';

  /**
   * Register the edit controller as ApplicationDetailController
   */

  angular
    .module('austackApp.application.detail')
    .controller('ApplicationDetailController', ApplicationDetailController);

  // add ApplicationDetailController dependencies to inject
  ApplicationDetailController.$inject = ['$scope', '$state', 'application', '$breadcrumb'];

  /**
   * ApplicationDetailController constructor
   */
  function ApplicationDetailController($scope, $state, application, $breadcrumb) {
    if (!application) {
      return $state.go('application.list');
    }

    var vm = this;

    // the current application to display
    vm.application = application;
    vm.tabIdx = $state.current.data.tabIdx;
  }
})();
