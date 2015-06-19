(function () {
  'use strict';

  angular
    .module('austackApp.layout.breadcrumb', ['ncy-angular-breadcrumb'])
    .controller('BreadcrumbController', BreadcrumbController);

  BreadcrumbController.$inject = [];
  /* @ngInject */
  function BreadcrumbController() {
    var vm = this;

  }
})();
