(function () {
  'use strict';

  angular
    .module('austackApp.layout.breadcrumb', ['ncy-angular-breadcrumb'])
    .config(configBreadcrumb)
    .controller('BreadcrumbController', BreadcrumbController);

  configBreadcrumb.$inject = ['$breadcrumbProvider'];

  function configBreadcrumb($breadcrumbProvider) {
    $breadcrumbProvider.setOptions({
      includeAbstract: true
    });
  }

  BreadcrumbController.$inject = [];
  /* @ngInject */
  function BreadcrumbController() {
    var vm = this;
  }
})();
