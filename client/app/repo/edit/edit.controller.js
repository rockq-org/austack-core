/**
 * @ngdoc controller
 * @name austackAppshape.list.edit.controller:RepoEditController
 * @description
 * Controller of the repo edit page of the admin section
 */

(function () {
  'use strict';

  /**
   * Register the edit controller as RepoEditController
   */

  angular
    .module('austackApp.repo.edit')
    .controller('RepoEditController', RepoEditController);

  /**
   * @ngdoc function
   * @name austackAppshape.list.edit.provider:RepoEditController
   * @description
   * Provider of the {@link austackAppshape.list.edit.controller:RepoEditController RepoEditController}
   * @param {Service} $state The state service to use
   * @param {Service} $stateParams The stateParams service to use
   * @param {Service} $mdDialog The dialog service to use
   * @param {Service} Toast The Toast service to use
   * @param {Service} RepoService The RepoService to use
   * @param {Resource} repo The repo data to use
   */

  RepoEditController.$inject = ['$state', '$stateParams', '$mdDialog', 'Toast', 'RepoService', 'repo'];

  function RepoEditController($state, $stateParams, $mdDialog, Toast, RepoService, repo) {
    var vm = this;

    // defaults
    vm.repo = angular.copy(repo, vm.repo);
    vm.displayName = repo.name;

    // view model bindings
    vm.update = update;
    vm.remove = remove;
    vm.goBack = goBack;
    vm.showList = showList;

    /**
     * Open the detail state with the current repo
     *
     */
    function goBack() {
      $state.go('^.detail', {
        id: vm.repo._id
      });
    }

    /**
     * Open the repo list state
     *
     */
    function showList() {
      $state.go('^');
    }
    /**
     * Updates a repo by using the RepoService save method
     * @param {Form} [form]
     */
    function update(form) {
      // refuse to work with invalid data
      if (!vm.repo._id || form && !form.$valid) {
        return;
      }

      RepoService.update(vm.repo)
        .then(updateRepoSuccess)
        .catch(updateRepoCatch);

      function updateRepoSuccess(updatedRepo) {
        // update the display name after successful save
        vm.displayName = updatedRepo.name;
        Toast.show({
          text: 'Repo ' + vm.displayName + ' updated'
        });
        if (form) {
          form.$setPristine();
        }
      }

      function updateRepoCatch(err) {
        Toast.show({
          type: 'warn',
          text: 'Error while updating Repo ' + vm.displayName,
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
     * Show a dialog to ask the repo if she wants to delete the current selected repo.
     * @param {AngularForm} form - The form to pass to the remove handler
     * @param {$event} ev - The event to pass to the dialog service
     */
    function remove(form, ev) {
      var confirm = $mdDialog.confirm()
        .title('Delete repo ' + vm.displayName + '?')
        .content('Do you really want to delete repo ' + vm.displayName + '?')
        .ariaLabel('Delete repo')
        .ok('Delete repo')
        .cancel('Cancel')
        .targetEvent(ev);

      $mdDialog.show(confirm)
        .then(performRemove);

      /**
       * Removes a repo by using the RepoService remove method
       * @api private
       */
      function performRemove() {
        RepoService.remove(vm.repo)
          .then(deleteRepoSuccess)
          .catch(deleteRepoCatch);

        function deleteRepoSuccess() {
          Toast.show({
            type: 'success',
            text: 'Repo ' + vm.displayName + ' deleted'
          });
          vm.showList();
        }

        function deleteRepoCatch(err) {
          Toast.show({
            type: 'warn',
            text: 'Error while deleting repo ' + vm.displayName,
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
