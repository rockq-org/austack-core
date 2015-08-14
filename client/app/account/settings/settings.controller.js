(function () {
  'use strict';

  angular
    .module('austackApp.account.settings')
    .controller('AccountSettingsController', AccountSettingsController);

  AccountSettingsController.$inject = ['$scope', '$mdDialog', 'Auth', 'CropImageService'];

  function AccountSettingsController($scope, $mdDialog, Auth, CropImageService) {
    var vm = this;

    var fileInput = document.querySelector('#fileInput');
    var target;

    vm.user = Auth.getCurrentUser();
    console.log(vm.user);
    vm.user.avatar = vm.user.avaar || 'assets/images/profile.png';
    vm.uploadImage = uploadImage;

    function uploadImage(ev) {
      target = ev;
      ev.preventDefault();
      fileInput.click();
    }

    $scope.myImage = '';
    $scope.myCroppedImage = '';

    angular.element(fileInput).on('change', handleFileSelect);

    function handleFileSelect(evt) {
      var file = evt.currentTarget.files[0];
      var reader = new FileReader();
      reader.onload = function (evt) {
        $scope.$apply(function ($scope) {
          var srcImage = evt.target.result;
          CropImageService.show(srcImage, target)
            .then(function (data) {
              vm.user.avatar = data;
            })
        });
      };
      reader.readAsDataURL(file);
    };
  }

})();
