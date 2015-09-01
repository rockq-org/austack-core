(function () {
  'use strict';

  angular.module('calHeatmap', [])
    .directive('calHeatmap', calHeatmap);

  function calHeatmap() {
    function link(scope, el) {
      var config = scope.config;
      var elemenent = el[0];
      var cal = new window.CalHeatMap();
      config.itemSelector = elemenent;
      cal.init(config);
    }

    return {
      template: '<div id="cal-heatmap" config="config"></div>',
      restrict: 'E',
      link: link,
      scope: {
        config: '='
      }
    };
  }

})();
