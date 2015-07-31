(function () {
  'use strict';

  /**
   * Register the list controller as RepoListController
   */
  angular
    .module('austackApp.repo.list')
    .controller('RepoListController', RepoListController);

  // add RepoListController dependencies to inject
  RepoListController.$inject = ['$scope', 'socket', '$state', 'repos', '$mdDialog'];

  /**
   * RepoListController constructor
   *
   * @param {Object} $scope - The current scope
   * @param {Object} socket - The socket service to register to
   * @param {$state} $state - The $state to activate routing states on
   * @param {Array} repos - The list of repos resolved for this route
   * @param {Service} ToggleComponent - The service for switching the detail view
   */
  function RepoListController($scope, socket, $state, repos, $mdDialog) {
    var vm = this;

    // the array of repos
    vm.repos = repos;

    // the selected item id
    var curRepoId = null;

    // check if this item is selected
    vm.isSelected = isSelected;
    // switch to the detail state
    vm.showSettings = showSettings;
    vm.showQuickstart = showQuickstart;
    vm.showLoginpage = showLoginpage;

    vm.create = createRepo;

    function createRepo() {
      $mdDialog.show({
        controller: 'RepoCreateController',
        controllerAs: 'create',
        templateUrl: 'app/repo/create/create.html',
        clickOutsideToClose: false
      });
    }

    /**
     * Check if the passed item is the current selected item
     *
     * @param {Object} repo - The object to check for selection
     */
    function isSelected(repo) {
      return curRepoId === repo._id;
    }

    /**
     * Open the detail state with the selected item
     *
     * @param {Object} repo - The repo to edit
     */
    function showSettings(repo) {
      curRepoId = repo._id;
      $state.go('repo.detail.settings', {
        'id': curRepoId
      });
    }

    function showQuickstart(repo) {
      curRepoId = repo._id;
      $state.go('repo.detail.quickstart', {
        'id': curRepoId
      });
    }

    function showLoginpage(repo) {
      curRepoId = repo._id;
      $state.go('repo.detail.loginpage', {
        'id': curRepoId
      });
    }

    // initialize the controller
    activate();

    /**
     * Register socket updates and unsync on scope $destroy event
     */
    function activate() {
      socket.syncUpdates('repo', vm.repos);
      $scope.$on('$destroy', unsyncRepoUpdates);

      function unsyncRepoUpdates() {
        socket.unsyncUpdates('repo');
      }
    }
  }

})();
