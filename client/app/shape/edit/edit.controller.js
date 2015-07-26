/**
 * @ngdoc controller
 * @name austackAppshape.list.edit.controller:ShapeEditController
 * @description
 * Controller of the shape edit page of the admin section
 */

(function () {
  'use strict';

  /**
   * Register the edit controller as ShapeEditController
   */

  angular
    .module('austackApp.shape.edit')
    .controller('ShapeEditController', ShapeEditController);

  /**
   * @ngdoc function
   * @name austackAppshape.list.edit.provider:ShapeEditController
   * @description
   * Provider of the {@link austackAppshape.list.edit.controller:ShapeEditController ShapeEditController}
   * @param {Service} $state The state service to use
   * @param {Service} $stateParams The stateParams service to use
   * @param {Service} $mdDialog The dialog service to use
   * @param {Service} Toast The Toast service to use
   * @param {Service} ShapeService The ShapeService to use
   * @param {Resource} shape The shape data to use
   */

  ShapeEditController.$inject = ['$state', '$stateParams', '$mdDialog', 'Toast', 'ShapeService', 'shape'];

  function ShapeEditController($state, $stateParams, $mdDialog, Toast, ShapeService, shape) {
    var vm = this;

    // defaults
    vm.shape = angular.copy(shape, vm.shape);
    vm.displayName = shape.name;

    // view model bindings
    vm.update = update;
    vm.remove = remove;
    vm.goBack = goBack;
    vm.showList = showList;

    /**
     * Open the detail state with the current shape
     *
     */
    function goBack() {
      $state.go('^.detail', {
        id: vm.shape._id
      });
    }

    /**
     * Open the shape list state
     *
     */
    function showList() {
      $state.go('^');
    }
    /**
     * Updates a shape by using the ShapeService save method
     * @param {Form} [form]
     */
    function update(form) {
      // refuse to work with invalid data
      if (!vm.shape._id || form && !form.$valid) {
        return;
      }

      ShapeService.update(vm.shape)
        .then(updateShapeSuccess)
        .catch(updateShapeCatch);

      function updateShapeSuccess(updatedShape) {
        // update the display name after successful save
        vm.displayName = updatedShape.name;
        Toast.show({
          text: 'Shape ' + vm.displayName + ' updated'
        });
        if (form) {
          form.$setPristine();
        }
      }

      function updateShapeCatch(err) {
        Toast.show({
          type: 'warn',
          text: 'Error while updating Shape ' + vm.displayName,
          link: {
            state: $state.$current,
            params: $stateParams
          }
        });

        if (form && err) {
          form.setResponseErrors(err.data);
        }
      }
    }

    /**
     * Show a dialog to ask the shape if she wants to delete the current selected shape.
     * @param {AngularForm} form - The form to pass to the remove handler
     * @param {$event} ev - The event to pass to the dialog service
     */
    function remove(form, ev) {
      var confirm = $mdDialog.confirm()
        .title('Delete shape ' + vm.displayName + '?')
        .content('Do you really want to delete shape ' + vm.displayName + '?')
        .ariaLabel('Delete shape')
        .ok('Delete shape')
        .cancel('Cancel')
        .targetEvent(ev);

      $mdDialog.show(confirm)
        .then(performRemove);

      /**
       * Removes a shape by using the ShapeService remove method
       * @api private
       */
      function performRemove() {
        ShapeService.remove(vm.shape)
          .then(deleteShapeSuccess)
          .catch(deleteShapeCatch);

        function deleteShapeSuccess() {
          Toast.show({
            type: 'success',
            text: 'Shape ' + vm.displayName + ' deleted'
          });
          vm.showList();
        }

        function deleteShapeCatch(err) {
          Toast.show({
            type: 'warn',
            text: 'Error while deleting shape ' + vm.displayName,
            link: {
              state: $state.$current,
              params: $stateParams
            }
          });

          if (form && err) {
            form.setResponseErrors(err, vm.errors);
          }
        }
      }
    }
  }
})();
