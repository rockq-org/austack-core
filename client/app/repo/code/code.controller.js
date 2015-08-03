(function () {
  'use strict';

  angular
    .module('austackApp.repo.code', ['austackApp.hljs'])
    .controller('RepoCodeController', RepoCodeController);

  /* @ngInject */
  function RepoCodeController($mdDialog, Repo, RepoService, Toast, repoSchema, repoName) {
    var vm = this;

    vm.step1 = '<script src="js/austack-variables.js"></script>';
    vm.step2 = [
      '<script src="lib/angular-jwt/dist/angular-jwt.js"></script>',
      '<script src="js/angular-austack.js"></script>'
    ].join('\n');
    vm.step3 = 'step 3 code here';
    vm.step4 = 'step 4 code here';

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