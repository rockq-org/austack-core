(function () {
  'use strict';

  angular
    .module('austackApp.repo.code', ['austackApp.hljs'])
    .controller('RepoCodeController', RepoCodeController);

  /* @ngInject */
  function RepoCodeController($mdDialog, Repo, RepoService, Toast, repoSchema, repoName, Config) {
    var vm = this;

    // vm.step1 = codeSample.step1;
    vm.API_URL = Config.API_URL;
    vm.clientId = 'clientIdhere';
    vm.clientSecret = 'clientSecrethere';
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
    vm.step5 = vm.step1;
    vm.step6 = vm.step1;
    vm.currentShowStep = '1';
    vm.showStep = showStep;
    vm.isShowStep = isShowStep;

    vm.close = close;
    vm.cancel = cancel;

    function showStep(step) {
      vm.currentShowStep = vm.currentShowStep === step ? '' : step;
    }

    function isShowStep(step) {
      if (vm.currentShowStep === step) {
        return true;
      }

      return false;
    }

    function close() {
      $mdDialog.hide();
    }

    function cancel() {
      $mdDialog.cancel();
    }
  }
})();