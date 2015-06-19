(function () {
  'use strict';

  angular
    .module('austackApp.layout.header', ['austackApp.auth'])
    .controller('HeaderController', HeaderController);

  HeaderController.$inject = ['Auth'];
  /* @ngInject */
  function HeaderController(Auth) {
    var vm = this;

    vm.logout = logout;

    /**
     * Logout the current user
     */
    function logout() {
      Auth.logout();
    }
  }
})();
