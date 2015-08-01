(function () {
  'use strict';

  angular
    .module('austackApp.shape.create', [])
    .controller('ShapeCreateController', ShapeCreateController);

  ShapeCreateController.$inject = ['$mdDialog', 'shapeTypes'];

  function ShapeCreateController($mdDialog, shapeTypes) {
    var vm = this;

    vm.field = {
      type: 'String',
      required: false,
      unique: false,
      index: false
    };
    vm.shapeTypes = shapeTypes;

    vm.create = createShape;
    vm.close = hideDialog;
    vm.cancel = cancelDialog;

    function createShape(form) {
      if (!vm.field.name || (form && !form.$valid)) {
        return;
      }
      $mdDialog.hide(vm.field);
    }

    function hideDialog() {
      $mdDialog.hide();
    }

    function cancelDialog() {
      $mdDialog.cancel();
    }
  }
})();
