(function () {
  'use strict';

  angular
    .module('austackApp.repo.list')
    .controller('RepoListController', RepoListController);

  /* @ngInject */
  function RepoListController(repoSchema, repoData, repoName, query, $mdSidenav, $mdDialog, RepoService, Toast, $q) {
    var vm = this;

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
    vm.bulkRemoveItems = bulkRemoveItems;
    vm.showCode = showCode;
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
    }

    function onPaginationChange(page, limit) {
      return RepoService.getRepoData(repoName, vm.query, success);
    }

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

    function bulkRemoveItems(ev) {
      var content = '您确定要删除用户这些用户?';
      var total = vm.selected.length;
      var promiseList = [];
      if (total === 0) {
        return;
      }

      for (var i = 0; i < total; i++) {
        content += ' ' + vm.selected[i].mobile;
        promiseList.push(RepoService.remove(repoName, vm.selected[i].uid));
      }

      var confirm = $mdDialog.confirm()
        .title('批量删除用户')
        .content(content)
        .ariaLabel('删除用户')
        .ok('删除用户')
        .cancel('取消')
        .targetEvent(ev);

      $mdDialog.show(confirm).then(function () {
        $q.all(promiseList)
          .then(function () {
            Toast.show('删除用户成功');
          })
          .catch(function (err) {
            Toast.show('删除用户' + err.uid + '失败');
          })
          .finally(function () {
            RepoService.getRepoData(repoName, vm.query)
              .then(function (data) {
                success(data);
                vm.closeDetail();
              });
          });
      });
    }

    function showCode(ev) {
      $mdDialog.show({
        controller: 'RepoCreateController',
        controllerAs: 'create',
        templateUrl: 'app/repo/create/create.html',
        locals: {
          repoSchema: repoSchema,
          repoName: repoName
        },
        targetEvent: ev
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

    function addItem(ev) {
      $mdDialog.show({
        controller: 'RepoCreateController',
        controllerAs: 'create',
        templateUrl: 'app/repo/create/create.html',
        locals: {
          repoSchema: repoSchema,
          repoName: repoName
        },
        targetEvent: ev
      });
    }
  }

})();