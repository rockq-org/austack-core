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
      show: showSettings,
      hide: hideSettings
    };

    function showSettings(ev) {
      var dialog = $mdDialog.show({
        controller: 'CropImageController',
        controllerAs: 'vm',
        templateUrl: 'app/components/crop-image/crop-image.html',
        parent: angular.element(document.body),
        targetEvent: ev,
      }).then(function (answer) {
        $log.debug('You said the information was "' + answer + '".');
      }, function () {
        $log.debug('You cancelled the dialog.');
      });
    }

    function hideSettings() {
      return $mdDialog.hide();
    }
  }

})();
