(function () {
  'use strict';

  angular
    .module('austackApp.layout')
    .controller('HeaderController', HeaderController);

  HeaderController.$inject = ['Auth', 'ProfileService', 'SettingsService'];
  /* @ngInject */
  function HeaderController(Auth, ProfileService, SettingsService) {
    var vm = this;

    vm.menus = [{
      name: '支持和帮助',
      url: '#'
    }, {
      name: '文档',
      url: '#'
    }];

    vm.user = Auth.getCurrentUser();
    vm.user.avatar = 'assets/images/profile.jpg';

    vm.profile = profile;
    vm.setting = setting;
    vm.logout = logout;

    function profile() {
      ProfileService.show();
    }

    function setting() {
      SettingsService.show();
    }

    function logout() {
      Auth.logout();
    }
  }
})();
