(function () {
  'use strict';

  angular
    .module('austackApp.layout')
    .constant('HeaderMenus', getHeaderMenus())
    .controller('HeaderController', HeaderController);

  function getHeaderMenus() {
    return [{
      name: '帮助',
      url: 'https://github.com/arrking/austack-issues/issues'
    }, {
      name: '文档',
      url: 'https://github.com/arrking/austack-issues/wiki'
    }, {
      name: '博客',
      url: 'http://blog.austack.com'
    }];
  }

  HeaderController.$inject = ['$mdSidenav', 'Auth', 'HeaderMenus', 'ProfileService', 'SettingsService'];
  /* @ngInject */
  function HeaderController($mdSidenav, Auth, HeaderMenus, ProfileService, SettingsService) {
    var vm = this;

    vm.menus = HeaderMenus;

    vm.user = Auth.getCurrentUser();
    vm.user.avatar = vm.user.avatar || 'assets/images/profile.png';

    vm.profile = profile;
    vm.setting = setting;
    vm.logout = logout;

    var sidenavId = 'mainMenu';

    vm.openSidebar = openSidebar;
    vm.closeSidebar = closeSidebar;

    function closeSidebar() {
      return $mdSidenav(sidenavId).close();
    }

    function openSidebar() {
      return $mdSidenav(sidenavId).open();
    }

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
