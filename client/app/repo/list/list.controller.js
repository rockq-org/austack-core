(function () {
  'use strict';

  angular
    .module('austackApp.repo.list')
    .controller('RepoListController', RepoListController);

  /* @ngInject */
  function RepoListController(repoSchema, repoData) {
    var vm = this;

    vm.listHeader = getListHeader();

    vm.listData = getListData();

    function getListHeader() {
      return 'uid | 手机 | 上次验证码发送时间 | 验证码过期时间 | 验证码 | 注册时间 | 上次登录时间'.split(' | ');
    }

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