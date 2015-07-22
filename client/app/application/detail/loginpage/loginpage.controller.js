(function () {
  'use strict';

  /**
   * Register the edit controller as ApplicationLoginpageController
   */

  angular
    .module('austackApp.application.detail.loginpage')
    .controller('ApplicationLoginpageController', ApplicationLoginpageController);

  // add ApplicationLoginpageController dependencies to inject
  ApplicationLoginpageController.$inject = ['Config', '$sce', '$mdDialog', '$mdToast', 'application', 'ApplicationService'];

  /**
   * ApplicationLoginpageController constructor
   */
  function ApplicationLoginpageController(Config, $sce, $mdDialog, $mdToast, application, ApplicationService) {
    var vm = this;
    var template = '\n<!DOCTYPE html> \n<html>\n \n<head lang="en"> \n  <meta charset="UTF-8"> \n  <title>登录Austack</title> \n  <link rel=stylesheet href=/css/style.css> \n  <style type="text/css"> \n    .as-overlay {\n      margin: 0; \n      display: table; \n      position: fixed; \n      left: 0; \n      top: 0; \n      bottom: 0; \n      right: 0; \n      width: 100%; \n      height: 100%; \n      overflow: hidden; \n      z-index: 9999; \n      font-weight: 200; \n      -webkit-user-select: none; \n      -moz-user-select: none; \n      -ms-user-select: none; \n      user-select: none; \n      background: rgba(0, 0, 0, .8); \n      -webkit-transition: 300ms opacity ease-out; \n      -moz-transition: 300ms opacity ease-out; \n      transition: 300ms opacity ease-out; \n      -webkit-transform: translate3d(0, 0, 0); \n      -moz-transform: translate3d(0, 0, 0); \n      -ms-transform: translate3d(0, 0, 0); \n      transform: translate3d(0, 0, 0); \n    } \n \n    .vertical-middle {\n      padding: 0; \n      vertical-align: middle; \n      display: table-cell; \n      margin: 0; \n    } \n \n    .container {\n      width: 280px; \n      margin: 0 auto; \n      text-align: center; \n      background: #fff; \n      border-radius: 3px; \n      box-shadow: 0 1px 10px rgba(0, 0, 0, .4); \n    } \n \n    .header img {\n      margin: 20px 0; \n    } \n \n    .as-btn, \n    .as-input {\n      border: 1px solid #ccc; \n      border-radius: 3px; \n      width: 238px; \n      height: 20px; \n      padding: 10px; \n      margin-bottom: 10px; \n    } \n \n    .as-btn {\n      width: 260px; \n      height: 40px; \n      color: #fff; \n      background: #16214D; \n    } \n \n    .as-input-small-left {\n      width: 148px; \n      float: left; \n      margin-left: 10px; \n    } \n \n    .as-btn-small-right {\n      width: 80px; \n      float: right; \n      margin-right: 10px; \n    } \n \n    .footer {\n      padding: 20px 0 10px; \n    } \n  </style> \n</head>\n \n<body> \n  <div class="as-overlay"> \n    <div class="vertical-middle"> \n      <div class="container"> \n        <div class="header"> \n          <img src="/img/logo.png" /> \n          <h1>应用名称</h1> \n        </div> \n        <div class="content">\n \n          <form method="POST"> \n            <input type="hidden" name="action" value="send-verification-code" /> \n            <input class="as-input as-input-small-left" type="text" name="mobile" placeholder="手机号" value="18959264502" /> \n            <input class="as-btn as-btn-small-right" type="submit" value="获取验证码" /> \n          </form>\n \n \n          <form method="POST"> \n            <input type="hidden" name="action" value="verify-code" /> \n            <input type="hidden" name="mobile" value="18959264502" /> \n            <input class="as-input" type="text" name="verificationCode" placeholder="请输入短信中的验证码" /> \n            <input class="as-btn" type="submit" value="验证并登录" /> \n          </form>\n \n        </div> \n        <div class="footer"> \n          <a href="http://austack.com" target="_blank"> \n            <img src="/img/favicon.ico" /> \n          </a> \n        </div>\n \n      </div> \n    </div> \n  </div> \n</body>\n \n</html>';

    // the current application to display
    vm.application = application;
    vm.template = application.loginTemplate || template;
    vm.preview = preview;
    vm.hideDialog = hideDialog;
    vm.update = updateTemplate;
    vm.discard = discard;
    vm.setDefault = setDefault;
    vm.aceLoaded = aceLoaded;

    function preview(ev) {
      vm.application.loginTemplatePreview = vm.template;
      ApplicationService.update(vm.application)
        .then(function () {
          var dialog = $mdDialog.show({
            controller: DialogController,
            templateUrl: 'app/Application/detail/loginpage/preview.html',
            parent: angular.element(document.body),
            targetEvent: ev
          });
        })
        .catch(function () {
          $mdToast.show(
            $mdToast.simple()
            .content('预览失败')
            .position('top right')
            .hideDelay(500)
          );
        });
    }

    function DialogController($scope) {
      $scope.template = vm.template;
      $scope.close = function () {
        $mdDialog.hide();
      };
      $scope.save = vm.update;
      $scope.url = $sce.trustAsResourceUrl(Config.API_URL + 'applications/' + application._id + '/login-page-preview');
    }

    function hideDialog() {
      return $mdDialog.hide();
    }

    function updateTemplate() {
      vm.application.loginTemplate = vm.template;
      ApplicationService.update(vm.application)
        .then(function () {
          $mdToast.show(
            $mdToast.simple()
            .content('登录模板保存成功')
            .position('top right')
            .hideDelay(500)
          );
        })
        .catch(function () {
          $mdToast.show(
            $mdToast.simple()
            .content('登录模板保存失败')
            .position('top right')
            .hideDelay(500)
          );
        });
    }

    function discard() {
      vm.template = application.loginTemplate;
    }

    function setDefault() {
      vm.template = template;
    }

    function aceLoaded(editor) {
      editor.$blockScrolling = Infinity;
    }
  }
})();
