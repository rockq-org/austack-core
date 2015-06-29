(function () {
  'use strict';

  angular
    .module('austackApp.layout.breadcrumb', ['ncy-angular-breadcrumb'])
    .config(configBreadcrumb)
    .directive('asBreadcrumb', Breadcrumb);

  configBreadcrumb.$inject = ['$breadcrumbProvider'];

  function configBreadcrumb($breadcrumbProvider) {
    $breadcrumbProvider.setOptions({
      includeAbstract: true
    });
  }

  Breadcrumb.$inject = [];

  function Breadcrumb() {
    var directive = {
      link: link,
      restrict: 'E',
      replace: true,
      templateUrl: 'app/layout/breadcrumb/breadcrumb.html'
    };

    return directive;

    function link(scope, elem, attrs) {}
  }

})();
