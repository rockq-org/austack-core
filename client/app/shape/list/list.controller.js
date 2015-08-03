(function () {
  'use strict';

  /**
   * Register the list controller as ShapeListController
   */
  angular
    .module('austackApp.shape.list')
    .controller('ShapeListController', ShapeListController);

  ShapeListController.$inject = ['$scope', 'shape', '$mdDialog', 'shapeTypes', 'ShapeService', 'Toast', '$mdSidenav', '_'];

  function ShapeListController($scope, shape, $mdDialog, shapeTypes, ShapeService, Toast, $mdSidenav, _) {
    var vm = this;

    vm.shape = shape.data;
    vm.schema = vm.shape.mSchema;
    vm.shapeTypes = shapeTypes;

    vm.checkUnique = checkUnique;

    vm.showDetail = showDetail;
    vm.closeDetail = closeDetail;

    vm.showCreate = showCreate;
    vm.closeCreate = closeCreate;

    vm.showEdit = showEdit;
    vm.closeEdit = closeEdit;

    vm.createField = createField;
    vm.updateField = updateField;
    vm.removeField = removeField;

    vm.moved = moved;

    vm.curField = null;
    vm.isUnique = true;

    function moved(idx) {
      vm.schema.splice(idx, 1);
      ShapeService.update(vm.shape, function () {
        Toast.show('字段排序成功');
      });
    }

    function checkUnique(form) {
      var unique = _.findIndex(vm.schema, {
        'name': vm.curField.name
      }) === -1;
      form.name.$setValidity('unique', unique);
    }

    function createField() {
      vm.schema.push(vm.curField);
      ShapeService.update(vm.shape, function () {
        Toast.show('更新字段成功');
        vm.closeCreate();
      });
    }

    function updateField() {
      //vm.schema[vm.curFieldKey] = vm.curField;
      ShapeService.update(vm.shape, function () {
        Toast.show('更新字段成功');
        vm.closeEdit();
      });
    }

    function removeField(ev) {
      var confirm = $mdDialog.confirm()
        .title('删除字段 ' + vm.curField.name + '?')
        .content('您确定要删除字段 ' + vm.curField.name + '?')
        .ariaLabel('删除字段')
        .ok('删除字段')
        .cancel('取消')
        .targetEvent(ev);

      $mdDialog.show(confirm).then(function () {
        var idx = vm.schema.indexOf(vm.curField);
        vm.schema.splice(idx, 1);
        ShapeService.update(vm.shape, function () {
          Toast.show('更新字段成功');
          vm.closeEdit();
          vm.closeDetail();
        });
      });
    }

    var detailNavID = 'detailView';

    function showDetail(field) {
      vm.curField = field;
      $mdSidenav(detailNavID)
        .toggle()
        .then(function () {});
    }

    function closeDetail() {
      $mdSidenav(detailNavID).close();
    }

    var editNavID = 'editView';

    function showEdit() {
      //vm.closeDetail();
      $mdSidenav(editNavID)
        .toggle()
        .then(function () {});
    }

    function closeEdit() {
      $mdSidenav(editNavID).close();
    }

    var createNavID = 'createView';

    function showCreate() {
      var field = {
        isSys: false,
        props: {
          type: 'String'
        }
      };
      vm.curField = field;
      $mdSidenav(createNavID)
        .toggle()
        .then(function () {});
    }

    function closeCreate() {
      $mdSidenav(createNavID).close();
    }
  }

})();
