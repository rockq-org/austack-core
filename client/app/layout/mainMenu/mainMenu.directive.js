(function () {
  'use strict';

  // register the service as MainMenu
  angular
    .module('austackApp.mainMenu')
    .directive('asMainMenu', MainMenu);

  // add MainMenu dependencies to inject
  MainMenu.$inject = ['$rootScope', '$mdSidenav', '$document'];

  /**
   * MainMenu directive
   */
  function MainMenu($rootScope, $mdSidenav, $document) {
    // directive definition members
    var directive = {
      link: link,
      restrict: 'E',
      replace: true,
      controller: 'SidebarController',
      controllerAs: 'menu',
      templateUrl: 'app/layout/mainMenu/mainMenu.html'
    };

    return directive;

    // directives link definition
    function link(scope, elem, attrs) {
      var componentId = attrs.mdComponentId || 'mainMenu';
      var mainContentArea = $document[0].querySelector(attrs.mainContent || 'main');

      $rootScope.$on('$locationChangeSuccess', openPage);

      /**
       * @ngdoc function
       * @name openPage
       * @methodOf mainMenu.directive:
       * @description
       * Open a page
       */
      function openPage() {
        $mdSidenav(componentId)
          .close();
        //.then(mainContentArea.focus());
      }
    }
  }

})();
