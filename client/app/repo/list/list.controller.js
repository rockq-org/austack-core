(function () {
  'use strict';

  angular
    .module('austackApp.repo.list')
    .controller('RepoListController', RepoListController);

  /* @ngInject */
  function RepoListController(repoSchema, repoData, $mdSidenav, $nutrition) {
    var vm = this;

    console.log(repoSchema);
    vm.listHeader = repoSchema;
    vm.listData = repoData.data;
    vm.showDetail = showDetail;
    vm.closeDetail = closeDetail;
    vm.removeItem = removeItem;
    vm.currentEditKey = null;

    vm.selected = [];

    vm.query = {
      filter: '',
      order: 'name',
      limit: 5,
      page: 1
    };

    function success(desserts) {
      vm.desserts = desserts;
    }

    // in the future we may see a few built in alternate headers but in the mean time
    // you can implement your own search header and do something like
    vm.search = function (predicate) {
      vm.filter = predicate;
      vm.deferred = $nutrition.desserts.get(vm.query, success).$promise;
    };

    vm.onOrderChange = function (order) {
      return $nutrition.desserts.get(vm.query, success).$promise;
    };

    vm.onPaginationChange = function (page, limit) {
      return $nutrition.desserts.get(vm.query, success).$promise;
    };

    var navID = 'detailView';

    function showDetail(key, value) {
      vm.currentEditKey = key,
        $mdSidenav(navID)
        .toggle()
        .then(function () {});
    }

    function closeDetail() {
      $mdSidenav(navID).close();
    }

    function removeItem(ev) {
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
  }

})();