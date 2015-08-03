(function () {
  'use strict';

  angular
    .module('austackApp.repo.code', ['austackApp.hljs'])
    .controller('RepoCodeController', RepoCodeController);

  /* @ngInject */
  function RepoCodeController($mdDialog, Repo, RepoService, Toast, repoSchema, repoName) {
    var vm = this;

    vm.step1 = [
      '    var request = require(\'superagent\');',
      '    request.post(apiBaseURL + \'/auth/application\')',
      '       .set(\'Content-Type\', \'application/json\')',
      '        .set(\'Accept\', \'application/json\')',
      '        .send({',
      '         clientId: clientId,',
      '        clientSecret: clientSecret',
      '      })',
      '      .end(function (err, res) {',
      '        if (err) {',
      '          return d.reject(err);',
      '        }',
      '        var applicationJwt = res.body.token;',
      '        var token = res.body.token;',
      '        set Authorization to \'Bearer \' + token',
      '      });'
    ].join('\n');

    vm.step2 = vm.step1;
    vm.step3 = vm.step1;
    vm.step4 = vm.step1;
    vm.currentShowStep = '';
    vm.showStep = showStep;
    vm.isShowStep = isShowStep;

    function showStep(step) {
      vm.currentShowStep = step;
    }

    function isShowStep(step) {
      if (vm.currentShowStep === step) {
        return true;
      }

      return false;
    }

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