(function () {
  'use strict';

  angular
    .module('austackApp.layout.header')
    .controller('HeaderController', HeaderController);

  HeaderController.$inject = ['Auth'];
  /* @ngInject */
  function HeaderController(Auth) {
    var vm = this;

    vm.menus = [{
      text: '升级账户',
      url: '#'
    }, {
      text: '支持和帮助',
      url: '#'
    }, {
      text: '文档',
      url: '#'
    }];

    vm.logout = logout;

    /**
     * Logout the current user
     */
    function logout() {
      Auth.logout();
    }
  }
})();
