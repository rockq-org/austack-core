(function () {
  'use strict';

  angular
    .module('austackApp.cropImage')
    .controller('CropImageController', CropImageController);

  CropImageController.$inject = ['$scope', '$mdDialog', 'srcImage'];

  function CropImageController($scope, $mdDialog, srcImage) {
    var vm = this;

    vm.srcImage = srcImage;
    vm.croppedImage = null;
    vm.save = saveImage;
    vm.close = closeDialog;

    function saveImage() {
      $mdDialog.hide(vm.croppedImage);
    }

    function closeDialog() {
      $mdDialog.cancel();
    };
  }

})();
