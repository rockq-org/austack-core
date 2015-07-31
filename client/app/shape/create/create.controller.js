(function () {
  'use strict';

  angular
    .module('austackApp.shape.create', [])
    .controller('ShapeCreateController', ShapeCreateController);

  ShapeCreateController.$inject = ['$mdDialog', 'Shape', 'ShapeService', 'Toast', 'shapeTypes'];

  function ShapeCreateController($mdDialog, Shape, ShapeService, Toast, shapeTypes) {
    var vm = this;

    vm.shape = new Shape();
    vm.shapeTypes = shapeTypes;

    vm.create = createShape;
    vm.close = hideDialog;
    vm.cancel = cancelDialog;

    function createShape(form) {
      // refuse to work with invalid data
      if (vm.shape._id || (form && !form.$valid)) {
        return;
      }

      ShapeService.create(vm.shape)
        .then(createShapeSuccess)
        .catch(createShapeCatch);

      function createShapeSuccess(newShape) {
        Toast.show({
          type: 'success',
          text: '应用 ' + newShape.name + ' 创建成功',
          link: {
            state: 'shape.detail',
            params: {
              id: newShape._id
            }
          }
        });
        vm.close();
      }

      function createShapeCatch(err) {
        if (form && err) {
          form.setResponseErrors(err);
        }

        Toast.show({
          type: 'warn',
          text: '创建应用失败'
        });
      }
    }

    function hideDialog() {
      $mdDialog.hide();
    }

    function cancelDialog() {
      $mdDialog.cancel();
    }
  }
})();
