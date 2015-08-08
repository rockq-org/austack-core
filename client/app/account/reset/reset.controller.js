(function () {
  'use strict';

  // register the controller as ResetController
  angular
    .module('austackApp.account')
    .controller('ResetController', ResetController);

  /* @ngInject */
  function ResetController($scope, $timeout, Toast, Auth, $state, User, $cookieStore) {
    // here we use $scope in case of the angular-timer
    var vm = this;

    // view model bindings
    vm.title = 'reset';
    vm.user = {};
    // vm.user = _demoData();
    vm.step = 'step1';
    vm.disableResendVerifyCodeBtn = false;
    vm.disableResendVerifyCodeBtn = true;
    vm.pending = false;
    vm.pendingMsg = '加载中...';
    vm.errorMsg = '';
    vm.getVerifyCode = getVerifyCode;
    vm.submitVerifyCode = submitVerifyCode;
    vm.setNewPassword = setNewPassword;
    vm.resendVerifyCode = resendVerifyCode;
    vm.countDownFinish = countDownFinish;
    vm.chageResendBtnState = chageResendBtnState;

    // vm.step = 'step3';

    function _demoData() {
      return {
        _id: '558a6edff7a49124d6edc764',
        name: '18959264502',
        verifyCode: '5168',
        userId: 'lymanlai-',
        password: 'laijinyue'
      };
    }

    function getVerifyCode(form) {
      if (form && form.$invalid) {
        return;
      }

      vm.step = 'loading';
      User.resendVerifyCode(vm.user).$promise.then(function (data) {
        vm.step = 'step2';
        vm.user.name = data.name;
        $cookieStore.put('mobile', data.name);
        vm.chageResendBtnState('disableResend');
      }).catch(function (err) {
        vm.step = 'step1';
        Toast.show('手机号未注册或验证码发送失败！');
      });
    }

    function countDownFinish() {
      $timeout(function () {
        vm.disableResendVerifyCodeBtn = false;
      });
    }

    function resendVerifyCode(form) {
      vm.step = 'loading';
      loadNameFromCookieStoreIfNotExist();
      User.resendVerifyCode(vm.user).$promise.then(function (data) {
        Toast.show('验证码发送成功！');
        vm.chageResendBtnState('disableResend');
      }).catch(function (err) {
        Toast.show('验证码发送失败！请60秒后再重试！');
        vm.chageResendBtnState('enableResend');
      });
    }

    function chageResendBtnState(state) {
      $timeout(function () {
        switch (state) {
        case 'enableResend':
          $scope.$broadcast('timer-stop');
          vm.disableResend = false;
          break;
        case 'disableResend':
          $scope.$broadcast('timer-start');
          vm.disableResend = true;
          break;
        }
        vm.step = 'step2';
      });
    }

    function submitVerifyCode(form) {
      if (form && form.$invalid) {
        return;
      }

      vm.step = 'loading';
      loadNameFromCookieStoreIfNotExist();
      User.verifyMobile(vm.user).$promise.then(function (data) {
        vm.step = 'step3';
        $cookieStore.put('token', data.token);
        Toast.show('验证成功！');
      }).catch(function (err) {
        Toast.show('验证码错误或验证码已过期！');
        vm.chageResendBtnState('enableResend');
      });
    }

    function setNewPassword(form) {
      if (form && form.$invalid) {
        return;
      }
      loadNameFromCookieStoreIfNotExist();

      vm.step = 'loading';
      User.setNewPassword(vm.user).$promise.then(function (data) {
        Toast.show('重置密码成功！', function () {
          $state.go('account.login');
        });
      }).catch(function (err) {
        vm.step = 'step3';
        switch (err.data.errors.userId.kind) {
        case 'regexp':
          Toast.show('用户ID不合法，只能包含字母数字及"-"，并以字母数字结尾');
          break;
        case 'user defined':
          Toast.show('该用户ID已被使用');
          break;
        default:
          Toast.show('未知错误');
        }
      });
    }

    function loadNameFromCookieStoreIfNotExist() {
      if (!vm.user.name) {
        vm.user.name = $cookieStore.get('mobile');
      }
    }

  }

})();