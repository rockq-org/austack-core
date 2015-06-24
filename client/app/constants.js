(function () {
  'use strict';

  angular
    .module('austackApp.constants', [])
    .constant('Config', getConfig());

  function getConfig() {
    return {
      API: '/api/',
      TEMPLATE_PREFIX: 'http://localhost:3000/app/'
    };

  }

})();
