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

    vm.showDetail = showDetail;
    vm.closeDetail = closeDetail;

    vm.showCreate = showCreate;
    vm.closeCreate = closeCreate;

    vm.updateField = updateField;
    vm.removeField = removeField;

    vm.addField = addField;

    vm.curField = null;

    function addField(ev) {
      $mdDialog.show({
        controller: 'ShapeCreateController',
        controllerAs: 'create',
        templateUrl: 'app/shape/create/create.html',
        clickOutsideToClose: false,
        targetEvent: ev
      }).then(function (data) {
        if (!data.name) {
          return;
        }

        var field = {
          name: data.name,
          isSys: false,
          props: {
            type: data.type,
            required: data.required,
            unique: data.unique,
            index: data.index
          }
        }

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

    var createNavID = 'createView';

    function showCreate() {
      var field = {
        isSys: false,
        props: {
          type: 'String'
        }
      }
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
