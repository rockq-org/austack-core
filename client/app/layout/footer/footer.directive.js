(function () {
  'use strict';

  angular
    .module('austackApp.layout')
    .directive('asFooter', Footer);

  Footer.$inject = [];

  function Footer() {
    var directive = {
      link: link,
      restrict: 'E',
      replace: true,
      templateUrl: 'app/layout/footer/footer.html'
    };

    return directive;

    function link(scope, elem, attrs) {
      scope.year = new Date().getFullYear();
    }
  }

})();
