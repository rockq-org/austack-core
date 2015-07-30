(function () {
  'use strict';

  // register the controller as ShapeController
  angular
    .module('austackApp.shape')
    .controller('ShapeController', ShapeController);

  // add ShapeController dependencies to inject
  ShapeController.$inject = ['$state', 'shapes', '$mdDialog'];

  /**
   * ShapeController constructor. Main controller for the austackApp.shape
   * module.
   *
   * @param {$scope} $scope - The scope to listen for events
   * @param {socket.io} socket - The socket to register updates
   */
  function ShapeController($state, shapes, $mdDialog) {
    var repoName = shapes.data[0];
    $state.go('shape.list', {
      repoName: repoName
    });
    var vm = this;
    vm.create = createShape;

    function createShape(ev) {
      $mdDialog.show({
        controller: 'ShapeCreateController',
        controllerAs: 'create',
        templateUrl: 'app/shape/create/create.html',
        targetEvent: ev
      });
    }
  }

})();
