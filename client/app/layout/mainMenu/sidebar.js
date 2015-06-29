/**
 * @ngdoc overview
 * @name mainMenu
 * @requires austackApp.lodash
 * @requires austackApp.auth
 * @description
 * The `austackApp.mainMenu` module which provides:
 *
 * - {@link mainMenu.controller:SidebarController SidebarController}
 * - {@link mainMenu.service:mainMenu mainMenu-service}
 */

(function () {
  'use strict';

  angular.module('austackApp.mainMenu', [
    'austackApp.lodash',
    'austackApp.auth'
  ]);

})();
