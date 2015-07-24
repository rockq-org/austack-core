(function () {
  'use strict';

  // register the controller as ResetCtrl
  angular
    .module('austackApp.account')
    .controller('ResetCtrl', ResetCtrl);

  /**
   * @ngInject
   */
  function ResetCtrl($scope, $timeout, $mdToast, Auth, $state, User, $cookieStore) {
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
        msg('手机号未注册或验证码发送失败！');
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
        msg('验证码发送成功！');
        vm.chageResendBtnState('disableResend');
      }).catch(function (err) {
        msg('验证码发送失败！请60秒后再重试！');
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
        msg('验证成功！');
      }).catch(function (err) {
        msg('验证码错误或验证码已过期！');
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
        msg('重置密码成功！', function () {
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

    function loadNameFromCookieStoreIfNotExist() {
      if (!vm.user.name) {
        vm.user.name = $cookieStore.get('mobile');
      };
    }

    function msg(title, callback) {
      var toast = $mdToast.simple()
        .content(title)
        .position('top right');

      $mdToast.show(toast);
      if (callback) {
        $timeout(callback, 3000);
      }
    }

  }

})();