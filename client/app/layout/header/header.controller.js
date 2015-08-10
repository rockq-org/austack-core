(function () {
  'use strict';

  angular
    .module('austackApp.layout')
    .constant('HeaderMenus', getHeaderMenus())
    .controller('HeaderController', HeaderController);

  function getHeaderMenus() {
    return [{
      name: '帮助',
      url: '#'
    }, {
      name: '文档',
      url: '#'
    }, {
      name: '博客',
      url: 'http://blog.austack.com'
    }];
  }

  HeaderController.$inject = ['Auth', 'HeaderMenus', 'ProfileService', 'SettingsService'];
  /* @ngInject */
  function HeaderController(Auth, HeaderMenus, ProfileService, SettingsService) {
    var vm = this;

    vm.menus = HeaderMenus;

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
