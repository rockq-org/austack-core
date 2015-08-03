(function () {
  'use strict';

  angular
    .module('austackApp.repo.create', [])
    .controller('RepoCreateController', RepoCreateController);

  /* @ngInject */
  function RepoCreateController($mdDialog, Repo, RepoService, Toast, repoSchema, repoName) {
    var vm = this;
    vm.repoSchema = repoSchema;

    vm.repo = {};

    vm.create = createRepo;
    vm.close = hideDialog;
    vm.cancel = cancelDialog;

    function createRepo(form) {
      RepoService.create(repoName, vm.repo)
        .then(createRepoSuccess)
        .catch(createRepoCatch);

      function createRepoSuccess(newRepo) {
        console.log(newRepo);
        newRepo = newRepo.data;
        Toast.show({
          type: 'success',
          text: newRepo.mobile + ' 创建成功'
        });
        vm.close();
      }

      function createRepoCatch(err) {
        console.log(err);

        Toast.show({
          type: 'warn',
          text: '创建失败'
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