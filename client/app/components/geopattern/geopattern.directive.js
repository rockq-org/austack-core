(function () {
  'use strict';

  angular
    .module('austackApp.geopattern', [])
    .factory('GeoPattern', GeopatternService)
    .directive('geopattern', geopattern);

  GeopatternService.$inject = ['$window'];

  function GeopatternService($window) {
    var GeoPattern = $window.GeoPattern;
    delete $window.GeoPattern;

    return GeoPattern;
  }

  geopattern.$inject = ['GeoPattern'];

  function geopattern(GeoPattern) {
    return {
      restrict: 'A',

      link: function ($scope, element, attrs) {
        var pattern = GeoPattern.generate(attrs.geopattern);
        element.css('background-image', pattern.toDataUrl());
      }
    };
  }

})();
