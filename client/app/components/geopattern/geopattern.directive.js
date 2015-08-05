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
      restrict: 'EA',

      link: function ($scope, element, attrs) {
        $scope.string = attrs.string;
        var pattern = GeoPattern.generate($scope.string);
        element.css('background-image', pattern.toDataUrl());
      }
    };
  }

})();
