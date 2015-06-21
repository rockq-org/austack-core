(function () {
  'use strict';

  // register the service as TenantMobile
  angular
    .module('austackApp.account.signup.directive', [
      'austackApp.tenant'
    ])
    .directive('asTenantMobile', asTenantMobile);

  /* @ngInject */
  function asTenantMobile($q, $timeout, Tenant) {
    // directive definition members
    var directive = {
      link: link,
      require: 'ngModel',
      restrict: 'A'
    };
    return directive;

    // directives link definition
    function link(scope, element, attrs, ctrl) {
      ctrl.$asyncValidators.asTenantMobile = function (modelValue, viewValue) {

        if (ctrl.$isEmpty(modelValue)) {
          // consider empty model valid
          return $q.when();
        }

        var def = $q.defer();

        $timeout(function () {
          // Mock a delayed response
          var mobiles = ['18959264502'];
          if (mobiles.indexOf(modelValue) === -1) {
            def.resolve();
          } else {
            def.reject();
          }
        }, 2000);

        return def.promise;
      };
      // element.text('this is the asTenantMobile directive');
    }
  }

})();