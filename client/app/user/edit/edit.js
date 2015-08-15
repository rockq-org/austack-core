/**
 * @ngdoc overview
 * @name austackApp.admin.user.list.edit
 * @description
 * The `austackApp.admin.user.list.edit` module which provides:
 *
 * - {@link austackApp.admin.user.list.items.controller:UserItemsController UserItemsController}
 *
 * @requires ui.router
 * @requires ngMaterial
 * @requires ngMessages
 * @requires components/auth
 * @requires components/repeatInput
 * @requires components/toast
 * @requires components/mongooseError
 * @requires components/remoteUnique
 */

(function () {
  'use strict';

  angular
    .module('austackApp.user.edit', [
      'ui.router',
      'ngMaterial',
      'ngMessages',
      'austackApp.auth',
      'austackApp.repeatInput',
      'austackApp.toast',
      'austackApp.mongooseError',
      'austackApp.remoteUnique'
    ])
    .config(configureUserListEdit);

  /**
   * Route configuration function configuring the passed $stateProvider.
   * Register the admin.user.list.edit state with the edit template
   * paired with the UserEditController as 'edit' for the
   * 'detail@admin.user.list' view.
   * 'user' is resolved as the user with the id found in
   * the state parameters.
   *
   * @param {$stateProvider} $stateProvider - The state provider to configure
   */

  configureUserListEdit.$inject = ['$stateProvider'];

  function configureUserListEdit($stateProvider) {
    // The edit state configuration.
    var editState = {
      name: 'user.edit',
      parent: 'user',
      url: '/:id/edit',
      authenticate: true,
      role: 'admin',
      views: {
        '': {
          templateUrl: 'app/user/edit/edit.html',
          controller: 'UserEditController',
          controllerAs: 'edit',
          resolve: {
            user: resolveUserFromArray
          }
        }
      }
    };

    $stateProvider.state(editState);
  }

  /**
   * Resolve dependencies for the admin.user.list.edit state
   *
   * @params {Array} users - The array of users
   * @params {$stateParams} $stateParams - The $stateParams to read the user id from
   * @returns {Object|null} The user whose value of the _id property equals $stateParams._id
   */

  resolveUserFromArray.$inject = ['users', '$stateParams', '_'];

  function resolveUserFromArray(users, $stateParams, _) {
    return _.find(users, {
      '_id': $stateParams.id
    });
  }

})();
