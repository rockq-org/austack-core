(function () {
  'use strict';

  angular
    .module('austackApp.repo.create', [])
    .controller('RepoCreateController', RepoCreateController);

  RepoCreateController.$inject = ['$mdDialog', 'Repo', 'RepoService', 'Toast'];

  function RepoCreateController($mdDialog, Repo, RepoService, Toast) {
    var vm = this;

    vm.repo = new Repo();

    vm.create = createRepo;
    vm.close = hideDialog;
    vm.cancel = cancelDialog;

    function createRepo(form) {
      // refuse to work with invalid data
      if (vm.repo._id || (form && !form.$valid)) {
        return;
      }

      RepoService.create(vm.repo)
        .then(createRepoSuccess)
        .catch(createRepoCatch);

      function createRepoSuccess(newRepo) {
        Toast.show({
          type: 'success',
          text: '应用 ' + newRepo.name + ' 创建成功',
          link: {
            state: 'repo.detail',
            params: {
              id: newRepo._id
            }
          }
        });
        vm.close();
      }

      function createRepoCatch(err) {
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
