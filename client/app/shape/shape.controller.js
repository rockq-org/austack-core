(function () {
  'use strict';

  // register the controller as ShapeController
  angular
    .module('austackApp.shape')
    .controller('ShapeController', ShapeController);

  // add ShapeController dependencies to inject
  ShapeController.$inject = ['$state', 'repos'];

  /**
   * ShapeController constructor. Main controller for the austackApp.shape
   * module.
   *
   * @param {$scope} $scope - The scope to listen for events
   * @param {socket.io} socket - The socket to register updates
   */
  function ShapeController($state, repos) {
    var repoName = repos.data[0];

    $state.go('shape.list', {
      repoName: repoName
    });
    var vm = this;
  }

})();
