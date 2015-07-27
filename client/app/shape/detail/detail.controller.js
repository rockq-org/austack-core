(function () {
  'use strict';

  /**
   * Register the edit controller as ShapeDetailController
   */

  angular
    .module('austackApp.shape.detail')
    .controller('ShapeDetailController', ShapeDetailController);

  // add ShapeDetailController dependencies to inject
  ShapeDetailController.$inject = ['$scope', '$state', 'shape', '$breadcrumb'];

  /**
   * ShapeDetailController constructor
   */
  function ShapeDetailController($scope, $state, shape, $breadcrumb) {
    if (!shape) {
      return $state.go('shape.list');
    }

    var vm = this;

    // the current shape to display
    vm.shape = shape;
    vm.tabIdx = $state.current.data.tabIdx;
  }
})();
