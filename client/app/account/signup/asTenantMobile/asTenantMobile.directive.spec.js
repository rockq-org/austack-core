'use strict';

describe('Directive: asTenantMobile', function () {

  // load the directive's module
  beforeEach(module('austackApp'));

  var element, scope;

  beforeEach(inject(function ($rootScope, $compile) {
    scope = $rootScope.$new();
    element = angular.element('<as-tenant-mobile></as-tenant-mobile>');
    element = $compile(element)(scope);
  }));

  it('should set the element text', function () {
    // element.text().should.equal('this is the asTenantMobile directive');
  });
});