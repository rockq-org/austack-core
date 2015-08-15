(function () {
  'use strict';

  // register the controller as ResetController
  angular
    .module('austackApp.account')
    .controller('ResetController', ResetController);

  /* @ngInject */
  function ResetController($scope, $timeout, Toast, Auth, $state, User, $cookieStore, Config) {
    // here we use $scope in case of the angular-timer
    var vm = this;

    // view model bindings
    vm.title = 'reset';
    vm.user = {};
    // vm.user = _demoData();
    vm.step = 'step1';
    vm.captchaUrl = Config.API_URL + 'users/captcha';
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
    vm.gotoLogin = gotoLogin;
    vm.reloadCaptcha = reloadCaptcha;

    // vm.step = 'step3';

    function _demoData() {
      return {
        _id: '558a6edff7a49124d6edc764',
        mobile: '18959264502',
        verifyCode: '5168',
        name: 'lymanlai-',
        password: 'laijinyue'
      };
    }

    function getVerifyCode(form) {
      if (form && form.$invalid) {
        return;
      }

      //vm.step = 'loading';
      User.resendVerifyCode(vm.user).$promise.then(function (data) {
        vm.step = 'step2';
        vm.user.mobile = data.mobile;
        $cookieStore.put('mobile', data.mobile);
        vm.chageResendBtnState('disableResend');
      }).catch(function (err) {
        vm.step = 'step1';
        var msg = '手机号未注册';
        if (err.data.type === 'captcha not validate') {
          msg = '验证码错误，请重新输入';
          vm.reloadCaptcha();
        }
        Toast.show(msg);
      });
    }

    function reloadCaptcha() {
      vm.captchaUrl = Config.API_URL + 'users/captcha?_=' + Math.random();
    }

    function countDownFinish() {
      $timeout(function () {
        vm.disableResendVerifyCodeBtn = false;
      });
    }

    function resendVerifyCode(form) {
      //vm.step = 'loading';
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

      //vm.step = 'loading';
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

      //vm.step = 'loading';
      User.setNewPassword(vm.user).$promise.then(function (data) {
        Toast.show('重置密码成功！');
        vm.step = 'step4';
      }).catch(function (err) {
        vm.step = 'step3';
        switch (err.data.errors.name.kind) {
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

    function gotoLogin() {
      $cookieStore.remove('token'); // remove token, so user can go to login state
      $state.go('account.login');
    }

    function loadNameFromCookieStoreIfNotExist() {
      if (!vm.user.mobile) {
        vm.user.mobile = $cookieStore.get('mobile');
      }
    }

  }

})();
