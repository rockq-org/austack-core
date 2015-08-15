(function () {
  'use strict';

  angular
    .module('austackApp.cropImage', [
      'ngImgCrop'
    ])
    .service('CropImageService', CropImageService);

  CropImageService.$inject = ['$mdDialog', '$log'];

  function CropImageService($mdDialog, $log) {

    return {
      show: showDialog,
      close: closeDialog
    };

    function showDialog(srcImage, ev) {
      var dialog = $mdDialog.show({
        controller: 'CropImageController',
        controllerAs: 'vm',
        templateUrl: 'app/components/crop-image/crop-image.html',
        //clickOutsideToClose: true,
        locals: {
          a: 'asdfasdf',
          srcImage: srcImage
        },
        parent: angular.element(document.body),
        targetEvent: ev,
      });
      return dialog;
    }

    function closeDialog() {
      return $mdDialog.cancel();
    }
  }

})();
