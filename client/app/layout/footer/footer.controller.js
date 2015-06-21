(function () {
  'use strict';

  angular
    .module('austackApp.layout.footer', [])
    .controller('FooterController', FooterController);

  FooterController.$inject = [];
  /* @ngInject */
  function FooterController() {
    var vm = this;

    vm.year = (new Date()).getFullYear();
  }
})();
