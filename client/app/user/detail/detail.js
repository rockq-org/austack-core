/**
 * @ngdoc overview
 * @name austackApp.admin.user.list.detail
 * @description
 * The `austackApp.admin.user.list.detail` module which provides:
 *
 * - {@link austackApp.admin.user.list.detail.controller:UserDetailController UserDetailController}
 *
 * @requires ui.router
 * @requires angularMoment
 * @requires austackApp.auth.user
 */
(function () {
  'use strict';

  angular
    .module('austackApp.user.detail', [
      'ui.router',
      'angularMoment',
      'austackApp.auth.user'
    ])
    .config(configureUserListDetail);

  /**
   * Route configuration function configuring the passed $stateProvider.
   * Register the 'user.detail' state with the detail template
   * paired with the UserDetailController as 'detail' for the
   * 'sidenav' sub view.
   * 'user' is resolved as the user with the id found in
   * the state parameters.
   *
   * @param {$stateProvider} $stateProvider - The state provider to configure
   */

  configureUserListDetail.$inject = ['$stateProvider'];

  function configureUserListDetail($stateProvider) {
    // The detail state configuration
    var detailState = {
      name: 'user.detail',
      parent: 'user',
      url: '/:id',
      authenticate: true,
      role: 'admin',
      views: {
        '': {
          templateUrl: 'app/user/detail/detail.html',
          controller: 'UserDetailController',
          controllerAs: 'detail',
          resolve: {
            user: resolveUserFromArray
          }
        }
      },
      ncyBreadcrumb: {
        label: '{{detail.user.name}}',
        parent: 'user.list'
      }
    };

    $stateProvider.state(detailState);
  }

  // inject resolveUserFromArray dependencies
  resolveUserFromArray.$inject = ['users', '$stateParams', '_'];

  /**
   * Resolve dependencies for the user.detail state
   *
   * @params {Array} users - The array of users
   * @params {$stateParams} $stateParams - The $stateParams to read the user id from
   * @returns {Object|null} The user whose value of the _id property equals $stateParams._id
   */
  function resolveUserFromArray(users, $stateParams, _) {
    return _.find(users, {
      '_id': $stateParams.id
    });
  }

})();
