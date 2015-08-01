(function () {
  'use strict';

  angular
    .module('austackApp.repo.list')
    .controller('RepoListController', RepoListController);

  /* @ngInject */
  function RepoListController(repoSchema, repoData) {
    var vm = this;

    vm.listHeader = repoSchema;

    console.log(repoData.data);
    vm.listData = repoData.data;
  }

})();