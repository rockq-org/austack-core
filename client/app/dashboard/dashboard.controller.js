/**
 * @ngdoc controller
 * @name austackApp.main.controller:DashboardController
 * @description
 * Controls mainly nothing currently
 */

(function () {
  'use strict';

  // register the controller as DashboardController
  angular
    .module('austackApp.dashboard')
    .controller('DashboardController', DashboardController);

  /**
   * @ngdoc function
   * @name austackApp.main.provider:DashboardController
   * @description
   * Provider of the {@link austackApp.main.controller:DashboardController DashboardController}
   *
   * @param {Service} $scope The scope service to use
   * @param {Service} $http The http service to use
   */

  DashboardController.$inject = [];

  function DashboardController() {
    var vm = this;

    var massive = [{
      date: '2015-8-3',
      value: '1'
    }, {
      date: '2015-8-4',
      value: '2'
    }, {
      date: '2015-9-3',
      value: '3'
    }, {
      date: '2015-10-14',
      value: '2'
    }, {
      date: '2015-10-13',
      value: '8'
    }, {
      date: '2015-7-3',
      value: '1'
    }, {
      date: '2015-7-4',
      value: '2'
    }, {
      date: '2015-7-7',
      value: '3'
    }, {
      date: '2015-7-14',
      value: '2'
    }, {
      date: '2015-6-3',
      value: '1'
    }, {
      date: '2015-6-4',
      value: '2'
    }, {
      date: '2015-6-5',
      value: '3'
    }, {
      date: '2015-6-14',
      value: '2'
    }];
    $('#js-glanceyear').glanceyear(massive);
  }

})();
