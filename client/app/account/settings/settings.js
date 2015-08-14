(function () {
  'use strict';

  angular
    .module('austackApp.account.settings', [
      'austackApp.cropImage'
    ])
    .config(configAccountSettingsLogin);

  // inject configAccountSettingsLogin dependencies
  configAccountSettingsLogin.$inject = ['$stateProvider'];

  /**
   * Route configuration function configuring the passed $stateProvider.
   * Register the user.login state with the list template for the
   * 'login' view paired with the UserMainController as 'login'.
   *
   * @param {$stateProvider} $stateProvider - The state provider to configure
   */
  function configAccountSettingsLogin($stateProvider) {
    // The login state configuration
    var state = {
      name: 'settings',
      parent: 'root',
      url: '/account/settings',
      authenticate: true,
      role: 'admin',
      templateUrl: 'app/account/settings/settings.html',
      controller: 'AccountSettingsController',
      controllerAs: 'vm',
      ncyBreadcrumb: {
        label: '账户设置'
      }
    };

    $stateProvider.state(state);
  }

})();
