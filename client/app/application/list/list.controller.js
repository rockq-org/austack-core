(function () {
  'use strict';

  /**
   * Register the list controller as ApplicationListController
   */
  angular
    .module('austackApp.application.list')
    .controller('ApplicationListController', ApplicationListController);

  // add ApplicationListController dependencies to inject
  ApplicationListController.$inject = ['$scope', 'socket', '$state', 'applications', '$mdDialog'];

  /**
   * ApplicationListController constructor
   *
   * @param {Object} $scope - The current scope
   * @param {Object} socket - The socket service to register to
   * @param {$state} $state - The $state to activate routing states on
   * @param {Array} applications - The list of applications resolved for this route
   * @param {Service} ToggleComponent - The service for switching the detail view
   */
  function ApplicationListController($scope, socket, $state, applications, $mdDialog) {
    var vm = this;

    // the array of applications
    vm.applications = applications;

    // the selected item id
    var curApplicationId = null;

    // check if this item is selected
    vm.isSelected = isSelected;
    // switch to the detail state
    vm.showInDetails = showInDetails;

    vm.create = createApplication;

    function createApplication() {
      $mdDialog.show({
        controller: 'ApplicationCreateController',
        controllerAs: 'create',
        templateUrl: 'app/application/create/create.html',
        clickOutsideToClose: false
      });
    }

    /**
     * Check if the passed item is the current selected item
     *
     * @param {Object} application - The object to check for selection
     */
    function isSelected(application) {
      return curApplicationId === application._id;
    }

    /**
     * Open the detail state with the selected item
     *
     * @param {Object} application - The application to edit
     */
    function showInDetails(application) {
      curApplicationId = application._id;
      $state.go('application.detail', {
        'id': curApplicationId
      });
    }

    // initialize the controller
    activate();

    /**
     * Register socket updates and unsync on scope $destroy event
     */
    function activate() {
      socket.syncUpdates('application', vm.applications);
      $scope.$on('$destroy', unsyncApplicationUpdates);

      function unsyncApplicationUpdates() {
        socket.unsyncUpdates('application');
      }
    }
  }

})();
