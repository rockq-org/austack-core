(function () {
  'use strict';

  /**
   * Register the list controller as ShapeListController
   */
  angular
    .module('austackApp.shape.list')
    .controller('ShapeListController', ShapeListController);

  // add ShapeListController dependencies to inject
  ShapeListController.$inject = ['$scope', 'socket', '$state', 'shapes', '$mdDialog'];

  /**
   * ShapeListController constructor
   *
   * @param {Object} $scope - The current scope
   * @param {Object} socket - The socket service to register to
   * @param {$state} $state - The $state to activate routing states on
   * @param {Array} shapes - The list of shapes resolved for this route
   * @param {Service} ToggleComponent - The service for switching the detail view
   */
  function ShapeListController($scope, socket, $state, shapes, $mdDialog) {
    var vm = this;

    // the array of shapes
    vm.shapes = shapes;

    // the selected item id
    var curShapeId = null;

    // check if this item is selected
    vm.isSelected = isSelected;
    // switch to the detail state
    vm.showSettings = showSettings;
    vm.showQuickstart = showQuickstart;
    vm.showLoginpage = showLoginpage;

    vm.create = createShape;

    function createShape() {
      $mdDialog.show({
        controller: 'ShapeCreateController',
        controllerAs: 'create',
        templateUrl: 'app/shape/create/create.html',
        clickOutsideToClose: false
      });
    }

    /**
     * Check if the passed item is the current selected item
     *
     * @param {Object} shape - The object to check for selection
     */
    function isSelected(shape) {
      return curShapeId === shape._id;
    }

    /**
     * Open the detail state with the selected item
     *
     * @param {Object} shape - The shape to edit
     */
    function showSettings(shape) {
      curShapeId = shape._id;
      $state.go('shape.detail.settings', {
        'id': curShapeId
      });
    }

    function showQuickstart(shape) {
      curShapeId = shape._id;
      $state.go('shape.detail.quickstart', {
        'id': curShapeId
      });
    }

    function showLoginpage(shape) {
      curShapeId = shape._id;
      $state.go('shape.detail.loginpage', {
        'id': curShapeId
      });
    }

    // initialize the controller
    activate();

    /**
     * Register socket updates and unsync on scope $destroy event
     */
    function activate() {
      socket.syncUpdates('shape', vm.shapes);
      $scope.$on('$destroy', unsyncShapeUpdates);

      function unsyncShapeUpdates() {
        socket.unsyncUpdates('shape');
      }
    }
  }

})();
