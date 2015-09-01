(function () {
  'use strict';

  angular
    .module('austackApp.account.settings')
    .controller('AccountSettingsController', AccountSettingsController);

  /* @ngInject */
  function AccountSettingsController($scope, $mdDialog, Toast, Auth, UserService, CropImageService) {
    var vm = this;

    var fileInput = document.querySelector('#fileInput');
    var target;

    vm.user = Auth.getCurrentUser();
    vm.user.avatar = vm.user.avatar || 'assets/images/profile.png';
    vm.uploadImage = uploadImage;
    vm.update = update;
    vm.changePassword = changePassword;

    function uploadImage(ev) {
      target = ev;
      ev.preventDefault();
      fileInput.click();
    }

    function update() {
      UserService.update(vm.user)
        .then(function (data) {
          Toast.show('更新成功');
        })
        .catch(function () {
          Toast.show('更新失败');
        });
    }

    function changePassword(form) {
      Auth
        .changePassword(vm.oldPassword, vm.newPassword)
        .then(function (data) {
          Toast.show('更新密码成功');
        })
        .catch(function () {
          Toast.show('原密码错误');
        });
    }

    angular.element(fileInput).on('change', handleFileSelect);

    function handleFileSelect(evt) {
      var file = evt.currentTarget.files[0];
      var reader = new FileReader();
      reader.onload = function (evt) {
        fileInput.value = null;
        $scope.$apply(function ($scope) {
          var srcImage = evt.target.result;
          CropImageService.show(srcImage, target)
            .then(function (data) {
              vm.user.avatar = data;
              update();
            });
        });
      };
      reader.readAsDataURL(file);
    }
  }

})();
