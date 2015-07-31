/**
 * @ngdoc controller
 * @name gmappApp.admin.user.list.items.controller:ShapeItemsController
 * @description
 * Controller of the user list items page of the admin section
 */

(function () {
  'use strict';

  /**
   * Register the list controller as ShapeItemsController
   */

  angular
    .module('austackApp.shape.list.items')
    .controller('ShapeItemsController', ShapeItemsController);

  /**
   * @ngdoc function
   * @name gmappApp.admin.user.list.items.provider:ShapeItemsController
   * @description
   * Provider of the {@link gmappApp.admin.user.list.items.controller:ShapeItemsController ShapeItemsController}
   *
   */

  ShapeItemsController.$inject = ['$state', 'Auth'];

  function ShapeItemsController($state, Auth) {
    var vm = this;

    // the selected item id
    var curShapeId = null;

    // check if this item is selected
    vm.isSelected = isSelected;
    // switch to the detail state
    vm.showInDetails = showInDetails;
    // get the role object for every user
    vm.getRole = Auth.getRole;

    /**
     * @ngdoc function
     * @name isSelected
     * @methodOf gmappApp.admin.user.list.items.controller:ShapeItemsController
     * @description
     * Check if the passed item is the current selected item
     *
     * @param {Object} user The object to check for selection
     * @returns {Boolean} True if the current selected item is equals the passed item
     */
    function isSelected(user) {
      return curShapeId === user._id;
    }

    /**
     * @ngdoc function
     * @name showInDetails
     * @methodOf gmappApp.admin.user.list.items.controller:ShapeItemsController
     * @description
     * Open the detail state with the selected item
     *
     * @param {Shape|Object} user The user to edit
     */
    function showInDetails(user) {
      curShapeId = user._id;
      $state.go('admin.user.list.detail', {
        'id': curShapeId
      });
    }
  }

})();
