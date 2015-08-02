(function () {
  'use strict';

  angular
    .module('austackApp.repo.list')
    .controller('RepoListController', RepoListController);

  /* @ngInject */
  function RepoListController(repoSchema, repoData, repoName, $mdSidenav, $mdDialog, RepoService, Toast) {
    var vm = this;

    vm.listHeader = repoSchema;
    vm.listData = repoData.data;
    vm.currentEditItem = null;
    vm.currentEditItemIndex = null;

    //methods
    vm.showDetail = showDetail;
    vm.closeDetail = closeDetail;
    vm.removeItem = removeItem;
    vm.updateItem = updateItem;

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

    function showDetail(item, index) {
      vm.currentEditItemIndex = index;
      vm.currentEditItem = item,
        $mdSidenav(navID)
        .toggle()
        .then(function () {});
    }

    function closeDetail() {
      $mdSidenav(navID).close();
    }

    function removeItem(ev) {
      var label = vm.currentEditItem['mobile'];
      var confirm = $mdDialog.confirm()
        .title('删除用户 ' + label + '?')
        .content('您确定要删除用户 ' + label + '?')
        .ariaLabel('删除用户')
        .ok('删除用户')
        .cancel('取消')
        .targetEvent(ev);

      $mdDialog.show(confirm).then(function () {
        RepoService.remove(repoName, vm.currentEditItem['uid'])
          .then(function () {
            Toast.show('删除用户成功');
            vm.listData.splice(vm.currentEditItemIndex, 1);
            vm.closeDetail();
          })
          .catch(function (err) {
            console.log(err);
            Toast.show('删除用户失败');
            vm.closeDetail();
          });
      });
    }

    function updateItem() {
      RepoService.update(repoName, vm.currentEditItem['uid'], vm.currentEditItem)
        .then(function () {
          Toast.show('更新用户成功');
          vm.listData.splice(vm.currentEditItemIndex, 1, vm.currentEditItem);
          vm.closeDetail();
        })
        .catch(function (err) {
          console.log(err);
          Toast.show('更新用户失败');
          vm.closeDetail();
        });
    }
  }

})();