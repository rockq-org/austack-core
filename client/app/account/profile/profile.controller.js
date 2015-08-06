(function () {
  'use strict';

  angular
    .module('austackApp.account')
    .controller('ProfileController', ProfileController);

  ProfileController.$inject = ['$scope', '$mdDialog', 'Auth'];

  function ProfileController($scope, $mdDialog, Auth) {
    var vm = this;

    $scope.myImage = '';
    $scope.croppedImage = '';

    vm.user = Auth.getCurrentUser();

    vm.user.avatar = vm.user.avaar || 'assets/images/profile.png';

    vm.close = function () {
      $mdDialog.hide();
    };
    angular.element(document.querySelector('#fileInput')).on('change', function (ev) {
      var file = ev.currentTarget.files[0];
      var reader = new FileReader();
      reader.onload = function (ev) {
        $scope.$apply(function ($scope) {
          $scope.myImage = ev.target.result;
        })
      }
    });
  }

})();
