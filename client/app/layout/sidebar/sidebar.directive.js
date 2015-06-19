(function () {
  'use strict';

  // register the service as Sidebar
  angular
    .module('austackApp.sidebar')
    .directive('sidebar', Sidebar);

  // add Sidebar dependencies to inject
  Sidebar.$inject = ['$rootScope', '$mdSidenav', '$document'];

  /**
   * Sidebar directive
   */
  function Sidebar($rootScope, $mdSidenav, $document) {
    // directive definition members
    var directive = {
      link: link,
      restrict: 'E',
      replace: true,
      templateUrl: 'app/layout/sidebar/sidebar.html'
    };

    return directive;

    // directives link definition
    function link(scope, elem, attrs) {
      var componentId = attrs.mdComponentId || 'sidebar';
      var mainContentArea = $document[0].querySelector(attrs.mainContent || 'main');

      $rootScope.$on('$locationChangeSuccess', openPage);

      /**
       * @ngdoc function
       * @name openPage
       * @methodOf sidebar.directive:
       * @description
       * Open a page
       */
      function openPage() {
        $mdSidenav(componentId)
          .close()
          .then(mainContentArea.focus());
      }
    }
  }


})();
