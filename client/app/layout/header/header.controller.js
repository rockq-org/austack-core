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
    vm.user.avatar = 'assets/images/profile.png';

    vm.profile = profile;
    vm.setting = setting;
    vm.logout = logout;

    function profile(ev) {
      ProfileService.show(ev);
    }

    function setting(ev) {
      SettingsService.show(ev);
    }

    function logout() {
      Auth.logout();
    }
  }
})();
