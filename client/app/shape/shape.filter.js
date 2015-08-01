(function () {
  'use strict';

  angular
    .module('austackApp.shape')
    .filter('shapeType', shapeType);

  // add Shape dependencies to inject
  shapeType.$inject = ['shapeTypes', '_'];

  function shapeType(shapeTypes, _) {
    return function (type) {
      return _.result(_.find(shapeTypes, {
        name: type
      }), 'text');
    }
  }

})();
