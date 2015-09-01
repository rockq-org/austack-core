(function () {
  'use strict';

  /**
   * Register the edit controller as RepoDetailController
   */

  angular
    .module('austackApp.repo.detail')
    .controller('RepoDetailController', RepoDetailController);

  // add RepoDetailController dependencies to inject
  RepoDetailController.$inject = ['$scope', '$state', 'repo', '$breadcrumb'];

  /**
   * RepoDetailController constructor
   */
  function RepoDetailController($scope, $state, repo, $breadcrumb) {
    if (!repo) {
      return $state.go('repo.list');
    }

    var vm = this;

    // the current repo to display
    vm.repo = repo;
    vm.tabIdx = $state.current.data.tabIdx;
  }
})();
