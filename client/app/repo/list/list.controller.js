(function () {
  'use strict';

  angular
    .module('austackApp.repo.list')
    .controller('RepoListController', RepoListController);

  /* @ngInject */
  function RepoListController(repoSchema, repoData) {
    var vm = this;

    console.log(repoSchema);
    vm.listHeader = repoSchema;

    vm.listData = getListData();

    function getListData() {
      return [{
        uid: 'ssss',
        mobile: '18959264502',
        mobile1: '18959264502',
        mobile2: '18959264502',
        mobile3: '18959264502',
        mobile4: '18959264502',
        mobile5: '18959264502'
      }];
    }
  }

})();