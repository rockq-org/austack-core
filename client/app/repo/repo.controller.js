(function () {
  'use strict';

  // register the controller as RepoController
  angular
    .module('austackApp.repo')
    .controller('RepoController', RepoController);

  // add RepoController dependencies to inject
  RepoController.$inject = ['$state', 'repos', '$mdDialog'];

  /**
   * RepoController constructor. Main controller for the austackApp.repo
   * module.
   *
   * @param {$scope} $scope - The scope to listen for events
   * @param {socket.io} socket - The socket to register updates
   */
  function RepoController($state, repos, $mdDialog) {
    var repoName = repos.data[0];
    console.log('here', repoName);
    $state.go('repo.list', {
      repoName: repoName
    });

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