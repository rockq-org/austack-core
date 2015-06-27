(function () {
  'use strict';

  angular
    .module('austackApp.layout.header')
    .directive('atHeader', Header);

  Header.$inject = [];

  function Header() {
    var directive = {
      link: link,
      restrict: 'E',
      replace: true,
      templateUrl: 'app/layout/header/header.html'
    };

    return directive;

    function link(scope, elem, attrs) {}
  }

})();
