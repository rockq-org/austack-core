(function () {
  'use strict';

  angular
    .module('austackApp.repo.list')
    .controller('RepoListController', RepoListController);

  /* @ngInject */
  function RepoListController(repoSchema, repoData, repoName, query, $mdSidenav, $mdDialog, RepoService, Toast) {
    var vm = this;

    console.log(repoData, repoSchema);
    vm.selected = [];
    vm.repoData = repoData;
    vm.listHeader = repoSchema;
    vm.listData = repoData.data;
    vm.currentEditItem = null;
    vm.currentEditItemIndex = null;

    //methods
    vm.onOrderChange = onOrderChange;
    vm.onPaginationChange = onPaginationChange;
    vm.showDetail = showDetail;
    vm.closeDetail = closeDetail;
    vm.removeItem = removeItem;
    vm.updateItem = updateItem;
    vm.addItem = addItem;

    vm.query = query;

    function success(data) {
      vm.repoData = data;
      vm.listData = data.data;
    }

    vm.search = function (predicate) {
      vm.filter = predicate;
      vm.deferred = RepoService.getRepoData(repoName, vm.query, success);
    };

    function onOrderChange(order) {
      vm.query.sortby = order;
      return RepoService.getRepoData(repoName, vm.query, success);
    };

    function onPaginationChange(page, limit) {
      return RepoService.getRepoData(repoName, vm.query, success);
    };

    var navID = 'detailView';

    function showDetail(item, index) {
      vm.currentEditItemIndex = index;
      vm.currentEditItem = item;
      $mdSidenav(navID)
        .toggle()
        .then(function () {});
    }

    function closeDetail() {
      $mdSidenav(navID).close();
    }

    function removeItem(ev) {
      var label = vm.currentEditItem.mobile;
      var confirm = $mdDialog.confirm()
        .title('删除用户 ' + label + '?')
        .content('您确定要删除用户 ' + label + '?')
        .ariaLabel('删除用户')
        .ok('删除用户')
        .cancel('取消')
        .targetEvent(ev);

      $mdDialog.show(confirm).then(function () {
        RepoService.remove(repoName, vm.currentEditItem.uid)
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
      RepoService.update(repoName, vm.currentEditItem.uid, vm.currentEditItem)
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

    function addItem($event) {
      $mdDialog.show({
        controller: 'RepoCreateController',
        controllerAs: 'create',
        templateUrl: 'app/repo/create/create.html',
        locals: {
          repoSchema: repoSchema,
          repoName: repoName
        },
        targetEvent: $event
      });
    }
  }

})();