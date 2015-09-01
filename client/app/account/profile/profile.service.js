(function () {
  'use strict';

  angular
    .module('austackApp.account')
    .service('ProfileService', ProfileService);

  ProfileService.$inject = ['$mdDialog', '$log'];

  function ProfileService($mdDialog, $log) {

    return {
      show: showProfile,
      hide: hideProfile
    };

    function showProfile(ev) {
      var dialog = $mdDialog.show({
        controller: 'ProfileController',
        controllerAs: 'vm',
        templateUrl: 'app/account/profile/profile.html',
        clickOutsideToClose: true,
        parent: angular.element(document.body),
        targetEvent: ev,
      });
    }

    function hideProfile() {
      return $mdDialog.hide();
    }
  }

})();
