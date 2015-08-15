(function () {
  'use strict';

  /**
   * Register the list controller as UserListController
   */
  angular
    .module('austackApp.user.list')
    .controller('UserListController', UserListController);

  // add UserListController dependencies to inject
  UserListController.$inject = ['Auth', 'users', '$state', '$scope', 'socket'];

  /**
   * UserListController constructor
   *
   * @param {Array} users - The list of users resolved for this route
   * @param {$state} $state - The $state to activate routing states on
   * @param {ToggleComponent} ToggleComponent - The toggle component service for switching the detail view
   */
  function UserListController(Auth, users, $state, $scope, socket) {
    var vm = this;

    // the array of users
    vm.users = users;

    // the selected item id
    var curUserId = null;

    // check if this item is selected
    vm.isSelected = isSelected;
    // switch to the detail state
    vm.showInDetails = showInDetails;
    // get the role object for every user
    vm.getRole = Auth.getRole;

    /**
     * @ngdoc function
     * @name isSelected
     * @methodOf austackApp.admin.user.list.items.controller:UserItemsController
     * @description
     * Check if the passed item is the current selected item
     *
     * @param {Object} user The object to check for selection
     * @returns {Boolean} True if the current selected item is equals the passed item
     */
    function isSelected(user) {
      return curUserId === user._id;
    }

    /**
     * @ngdoc function
     * @name showInDetails
     * @methodOf austackApp.admin.user.list.items.controller:UserItemsController
     * @description
     * Open the detail state with the selected item
     *
     * @param {User|Object} user The user to edit
     */
    function showInDetails(user) {
      curUserId = user._id;
      $state.go('user.detail', {
        'id': curUserId
      });
    }

    // initialize the controller
    activate();

    /**
     * Register socket updates and unsync on scope $destroy event
     */
    function activate() {
      socket.syncUpdates('user', vm.users);
      $scope.$on('$destroy', unsyncUserUpdates);

      function unsyncUserUpdates() {
        socket.unsyncUpdates('user');
      }
    }
  }

})();
