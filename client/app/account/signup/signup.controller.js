(function () {
  'use strict';

  // register the controller as SignupCtrl
  angular
    .module('austackApp.account.signup')
    .controller('SignupCtrl', SignupCtrl);


  /**
   * @ngInject
   */
  function SignupCtrl($timeout, $mdToast, Auth, $state, Tenant, Config) {
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
        // _id: '558a24449e2fc2056cb4ff31',
        mobile: '18959264501',
        verifyCode: '1234',
        userId: 'lymanlai',
        password: 'laijinyue'
      };
    }

    function getVerifyCode(form) {
      if (form && form.$invalid) {
        return;
      }

      vm.step = 'loading';
      Tenant.create({
        mobile: vm.user.mobile
      }).$promise.then(function (data) {
        vm.step = 'step2';
        vm.user._id = data._id;
      }).catch(function (err) {
        vm.step = 'step1';
        Msg('手机号不合法或者已经被注册');
      });
    }

    function submitVerifyCode(form) {
      if (form && form.$invalid) {
        return;
      }

      vm.step = 'loading';
      Tenant.verifyMobile(vm.user).$promise.then(function (data) {
        vm.step = 'step3';
      }).catch(function (err) {
        vm.step = 'step2';
        Msg('验证码错误或验证码已过期！');
      });
    }

    function submitUserDetail(form) {
      if (form && form.$invalid) {
        return;
      }

      vm.step = 'loading';
      Tenant.submitUserDetail(vm.user).$promise.then(function (data) {
        Msg('注册成功！', function () {
          $state.go('account.login');
        });
      }).catch(function (err) {
        vm.step = 'step3';
        Msg('该用户ID已被使用');
      });
    }

    function resendVerifyCode(form) {
      vm.step = 'step2';
    }

    function Msg(title, callback) {
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
