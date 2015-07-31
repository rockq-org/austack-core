/**
 * @ngdoc overview
 * @name austackApp
 * @description
 * Module definition for the austackApp module.
 */

(function () {
  'use strict';

  angular
    .module('austackApp', [
      // Add modules below
      'austackApp.application',
      'ngCookies',
      'ngResource',
      'ngSanitize',
      'ngMessages',
      'ngMaterial',
      'ui.router',
      'ui.ace',
      'calHeatmap',
      'btford.socket-io',
      'angular-loading-bar',
      'austackApp.config',
      'austackApp.lodash',
      'austackApp.directive',
      'austackApp.mainMenu',
      'austackApp.io',
      'austackApp.socket',
      'austackApp.auth',
      'austackApp.account',
      'austackApp.dashboard',
      'austackApp.user',
      'austackApp.repo',
      'austackApp.shape',
      'austackApp.layout'
    ])
    .config(appConfig)
    .run(appRun);

  /* App configuration */

  // add appConfig dependencies to inject
  appConfig.$inject = ['Config', '$urlRouterProvider', '$urlMatcherFactoryProvider', '$locationProvider', '$mdThemingProvider', '$mdIconProvider', '$httpProvider'];

  /**
   * Application config function
   *
   * @param $stateProvider
   * @param $urlRouterProvider
   * @param $locationProvider
   */
  function appConfig(Config, $urlRouterProvider, $urlMatcherFactoryProvider, $locationProvider, $mdThemingProvider, $mdIconProvider, $httpProvider) {
    $urlRouterProvider.otherwise('/');
    $urlMatcherFactoryProvider.strictMode(false);
    $locationProvider.html5Mode(true);

    $httpProvider.interceptors.push('AuthInterceptor');
    /*
        // set the default palette name
        var defaultPalette = 'teal';
        // define a palette to darken the background of components
        var greyBackgroundMap = $mdThemingProvider.extendPalette(defaultPalette, {
          'A100': 'fafafa'
        });

        $mdThemingProvider.definePalette('grey-background', greyBackgroundMap);
        $mdThemingProvider.setDefaultTheme(defaultPalette);

        // customize the theme
        $mdThemingProvider
          .theme('default')
          .primaryPalette(defaultPalette)
          .accentPalette('pink')
          .backgroundPalette('grey-background');
    */

    $mdThemingProvider
      .theme('default')
      .primaryPalette('blue')
      .accentPalette('orange')
      .warnPalette('deep-orange');

    var spritePath = 'assets/svg-sprite/';
    $mdIconProvider.iconSet('navigation', spritePath + 'svg-sprite-navigation.svg');
    $mdIconProvider.iconSet('action', spritePath + 'svg-sprite-action.svg');
    $mdIconProvider.iconSet('content', spritePath + 'svg-sprite-content.svg');
    $mdIconProvider.iconSet('toggle', spritePath + 'svg-sprite-toggle.svg');
    $mdIconProvider.iconSet('alert', spritePath + 'svg-sprite-alert.svg');
  }

  /* App run bootstrap */

  // add appConfig dependencies to inject
  appRun.$inject = ['$rootScope', '$location', 'Auth'];

  /**
   * Application run function
   *
   * @param $rootScope
   * @param $location
   * @param Auth
   */
  function appRun($rootScope, $location, Auth) {
    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$stateChangeStart', function (event, next) {
      if (!next.authenticate) {
        return;
      }

      Auth.isLoggedInAsync(function (loggedIn) {
        var noPermission = next.role && !Auth.hasRole(next.role);
        if (!loggedIn || noPermission) {
          $location.path('/login');
        }
      });
    });
  }

})();
