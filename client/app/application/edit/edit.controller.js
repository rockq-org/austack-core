/**
 * @ngdoc controller
 * @name austackAppapplication.list.edit.controller:ApplicationEditController
 * @description
 * Controller of the application edit page of the admin section
 */

(function () {
  'use strict';

  /**
   * Register the edit controller as ApplicationEditController
   */

  angular
    .module('austackApp.application.edit')
    .controller('ApplicationEditController', ApplicationEditController);

  /**
   * @ngdoc function
   * @name austackAppapplication.list.edit.provider:ApplicationEditController
   * @description
   * Provider of the {@link austackAppapplication.list.edit.controller:ApplicationEditController ApplicationEditController}
   * @param {Service} $state The state service to use
   * @param {Service} $stateParams The stateParams service to use
   * @param {Service} $mdDialog The dialog service to use
   * @param {Service} Toast The Toast service to use
   * @param {Service} ApplicationService The ApplicationService to use
   * @param {Resource} application The application data to use
   */

  ApplicationEditController.$inject = ['$state', '$stateParams', '$mdDialog', 'Toast', 'ApplicationService', 'application'];

  function ApplicationEditController($state, $stateParams, $mdDialog, Toast, ApplicationService, application) {
    var vm = this;

    // defaults
    vm.application = angular.copy(application, vm.application);
    vm.displayName = application.name;

    // view model bindings
    vm.update = update;
    vm.remove = remove;
    vm.goBack = goBack;
    vm.showList = showList;

    /**
     * Open the detail state with the current application
     *
     */
    function goBack() {
      $state.go('^.detail', {
        id: vm.application._id
      });
    }

    /**
     * Open the application list state
     *
     */
    function showList() {
        $state.go('^');
      }
      /**
       * Updates a application by using the ApplicationService save method
       * @param {Form} [form]
       */
    function update(form) {
      // refuse to work with invalid data
      if (!vm.application._id || form && !form.$valid) {
        return;
      }

      ApplicationService.update(vm.application)
        .then(updateApplicationSuccess)
        .catch(updateApplicationCatch);

      function updateApplicationSuccess(updatedApplication) {
        // update the display name after successful save
        vm.displayName = updatedApplication.name;
        Toast.show({
          text: 'Application ' + vm.displayName + ' updated'
        });
        if (form) {
          form.$setPristine();
        }
      }

      function updateApplicationCatch(err) {
        Toast.show({
          type: 'warn',
          text: 'Error while updating Application ' + vm.displayName,
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
     * Show a dialog to ask the application if she wants to delete the current selected application.
     * @param {AngularForm} form - The form to pass to the remove handler
     * @param {$event} ev - The event to pass to the dialog service
     */
    function remove(form, ev) {
      var confirm = $mdDialog.confirm()
        .title('Delete application ' + vm.displayName + '?')
        .content('Do you really want to delete application ' + vm.displayName + '?')
        .ariaLabel('Delete application')
        .ok('Delete application')
        .cancel('Cancel')
        .targetEvent(ev);

      $mdDialog.show(confirm)
        .then(performRemove);

      /**
       * Removes a application by using the ApplicationService remove method
       * @api private
       */
      function performRemove() {
        ApplicationService.remove(vm.application)
          .then(deleteApplicationSuccess)
          .catch(deleteApplicationCatch);

        function deleteApplicationSuccess() {
          Toast.show({
            type: 'success',
            text: 'Application ' + vm.displayName + ' deleted'
          });
          vm.showList();
        }

        function deleteApplicationCatch(err) {
          Toast.show({
            type: 'warn',
            text: 'Error while deleting application ' + vm.displayName,
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
