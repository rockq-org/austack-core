(function () {
  'use strict';

  // register the controller as SignupCtrl
  angular
    .module('austackApp.account')
    .controller('SignupCtrl', SignupCtrl);

  /**
   * @ngInject
   */
  function SignupCtrl($timeout, $mdToast, Auth, $state, User) {
    var vm = this;

    // view model bindings
    vm.title = 'signup';
    vm.user = {};
    // vm.user = _demoData();
    vm.step = 'step1';
    vm.pending = false;
    vm.pendingMsg = '加载中...';
    vm.errorMsg = '';
    vm.getVerifyCode = getVerifyCode;
    vm.submitVerifyCode = submitVerifyCode;
    vm.submitUserDetail = submitUserDetail;
    vm.resendVerifyCode = resendVerifyCode;

    // vm.step = 'step3';

    function _demoData() {
      return {
        _id: '558a6edff7a49124d6edc764',
        name: '18959264502',
        verifyCode: '1234',
        userId: 'lymanlai-',
        password: 'laijinyue'
      };
    }

    function getVerifyCode(form) {
      if (form && form.$invalid) {
        return;
      }

      vm.step = 'loading';
      User.create({
        name: vm.user.name,
        role: 'admin' // for tenant's role
      }).$promise.then(function (data) {
        vm.step = 'step2';
        vm.user._id = data._id;
      }).catch(function (err) {
        vm.step = 'step1';
        msg('手机号不合法或者已经被注册');
      });
    }

    function submitVerifyCode(form) {
      if (form && form.$invalid) {
        return;
      }

      vm.step = 'loading';
      User.verifyMobile(vm.user).$promise.then(function (data) {
        vm.step = 'step3';
        msg('验证成功！');
      }).catch(function (err) {
        vm.step = 'step2';
        msg('验证码错误或验证码已过期！');
      });
    }

    function submitUserDetail(form) {
      if (form && form.$invalid) {
        return;
      }

      vm.step = 'loading';
      User.submitUserDetail(vm.user).$promise.then(function (data) {
        msg('注册成功！', function () {
          $state.go('account.login');
        });
      }).catch(function (err) {
        vm.step = 'step3';
        switch (err.data.type) {
        case 'formatInvalidate':
          msg('用户ID不合法，只能包含字母数字及"-"，并以字母数字结尾');
          break;
        case 'inuse':
          msg('该用户ID已被使用');
          break;
        }
      });
    }

    function resendVerifyCode(form) {
      vm.step = 'step2';
    }

    function msg(title, callback) {
      var toast = $mdToast.simple()
        .content(title)
        // .action('OK')
        // .highlightAction(false)
        .position('top right');
      $mdToast.show(toast);
      if (callback) {
        $timeout(callback, 3000);
      }
    }

  }

})();
