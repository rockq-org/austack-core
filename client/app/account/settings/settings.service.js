(function () {
  'use strict';

  angular
    .module('austackApp.account')
    .service('SettingsService', SettingsService)
    .controller('SettingsController', SettingsController);

  SettingsService.$inject = ['$mdDialog', '$log'];

  function SettingsService($mdDialog, $log) {

    return {
      show: showSettings,
      hide: hideSettings
    };

    function showSettings(ev) {
      var dialog = $mdDialog.show({
        controller: 'SettingsController',
        controllerAs: 'vm',
        templateUrl: 'app/account/settings/settings.html',
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

  SettingsController.$inject = ['$mdDialog'];

  function SettingsController($mdDialog) {
    var vm = this;

    vm.hide = function () {
      $mdDialog.hide();
    };
    vm.cancel = function () {
      $mdDialog.cancel();
    };
    vm.answer = function (answer) {
      $mdDialog.hide(answer);
    };
  }

})();
