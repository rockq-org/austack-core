(function () {
  'use strict';

  /**
   * Register the list controller as ShapeListController
   */
  angular
    .module('austackApp.shape.list')
    .controller('ShapeListController', ShapeListController);

  ShapeListController.$inject = ['$scope', 'shape', '$mdDialog', 'shapeTypes', 'ShapeService', 'Toast', '$mdSidenav'];

  function ShapeListController($scope, shape, $mdDialog, shapeTypes, ShapeService, Toast, $mdSidenav) {
    var vm = this;

    // the array of shape
    vm.shape = shape.data;
    vm.schema = vm.shape.mSchema;
    vm.shapeTypes = shapeTypes;

    // switch to the detail state
    vm.showDetail = showDetail;
    vm.closeDetail = closeDetail;

    vm.updateField = updateField;
    vm.removeField = removeField;

    vm.addField = addField;

    vm.curFieldKey = null;
    vm.curField = null;

    function addField(ev) {
      $mdDialog.show({
        controller: 'ShapeCreateController',
        controllerAs: 'create',
        templateUrl: 'app/shape/create/create.html',
        clickOutsideToClose: false,
        targetEvent: ev
      }).then(function (field) {
        if (!field.name) {
          return;
        }

        var fieldName = field.name;
        delete field.name;
        vm.schema[fieldName] = field;
        ShapeService.update(vm.shape, function () {
          Toast.show('添加字段成功');
        });
      });
    }

    function updateField() {
      vm.schema[vm.curFieldKey] = vm.curField;
      ShapeService.update(vm.shape, function () {
        Toast.show('更新字段成功');
      });
    }

    function removeField(ev) {
      var confirm = $mdDialog.confirm()
        .title('删除字段 ' + vm.curFieldKey + '?')
        .content('您确定要删除字段 ' + vm.curFieldKey + '?')
        .ariaLabel('删除字段')
        .ok('删除字段')
        .cancel('取消')
        .targetEvent(ev);

      $mdDialog.show(confirm).then(function () {
        delete vm.schema[vm.curFieldKey];
        ShapeService.update(vm.shape, function () {
          Toast.show('更新字段成功');
          vm.closeDetail();
        });
      });
    }

    var navID = 'detailView';

    function showDetail(key, value) {
      vm.curFieldKey = key,
        vm.curField = value;
      $mdSidenav(navID)
        .toggle()
        .then(function () {});
    }

    function closeDetail() {
      $mdSidenav(navID).close();
    }
  }

})();
