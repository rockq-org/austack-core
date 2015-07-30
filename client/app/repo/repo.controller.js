(function () {
  'use strict';

  // register the controller as RepoController
  angular
    .module('austackApp.repo')
    .controller('RepoController', RepoController);

  // add RepoController dependencies to inject
  RepoController.$inject = ['$mdDialog'];

  /**
   * RepoController constructor. Main controller for the austackApp.repo
   * module.
   *
   * @param {$scope} $scope - The scope to listen for events
   * @param {socket.io} socket - The socket to register updates
   */
  function RepoController($mdDialog) {
    var vm = this;

    vm.create = createRepo;

    function createRepo(ev) {
      $mdDialog.show({
        controller: 'RepoCreateController',
        controllerAs: 'create',
        templateUrl: 'app/repo/create/create.html',
        targetEvent: ev
      });
    }
  }

})();
