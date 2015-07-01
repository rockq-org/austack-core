(function () {
  'use strict';

  // register the controller as ApplicationController
  angular
    .module('austackApp.application')
    .controller('ApplicationController', ApplicationController);

  // add ApplicationController dependencies to inject
  ApplicationController.$inject = ['$mdDialog'];

  /**
   * ApplicationController constructor. Main controller for the austackApp.application
   * module.
   *
   * @param {$scope} $scope - The scope to listen for events
   * @param {socket.io} socket - The socket to register updates
   */
  function ApplicationController($mdDialog) {
    var vm = this;

    vm.create = createApplication;

    function createApplication() {
      $mdDialog.show({
        controller: 'ApplicationCreateController',
        controllerAs: 'create',
        templateUrl: 'app/application/create/create.html',
        clickOutsideToClose: false
      });
    }
  }

})();
