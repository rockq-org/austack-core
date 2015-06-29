/**
 * @ngdoc controller
 * @name austackAppapp.list.edit.controller:AppEditController
 * @description
 * Controller of the app edit page of the admin section
 */

(function () {
	'use strict';

	/**
	 * Register the edit controller as AppEditController
	 */

	angular
		.module('austackApp.app.list.edit')
		.controller('AppEditController', AppEditController);

	/**
	 * @ngdoc function
	 * @name austackAppapp.list.edit.provider:AppEditController
	 * @description
	 * Provider of the {@link austackAppapp.list.edit.controller:AppEditController AppEditController}
	 * @param {Service} $state The state service to use
	 * @param {Service} $stateParams The stateParams service to use
	 * @param {Service} $mdDialog The dialog service to use
	 * @param {Service} Toast The Toast service to use
	 * @param {Service} AppService The AppService to use
	 * @param {Resource} app The app data to use
	 */

	AppEditController.$inject = ['$state', '$stateParams', '$mdDialog', 'Toast', 'AppService', 'app'];

	function AppEditController($state, $stateParams, $mdDialog, Toast, AppService, app) {
		var vm = this;

		// defaults
		vm.app = angular.copy(app, vm.app);
		vm.displayName = app.name;

		// view model bindings
		vm.update = update;
		vm.remove = remove;
		vm.goBack = goBack;
		vm.showList = showList;

		/**
		 * Open the detail state with the current app
		 *
		 */
		function goBack() {
			$state.go('^.detail', {id: vm.app._id});
		}

		/**
		 * Open the app list state
		 *
		 */
		function showList() {
			$state.go('^');
		}
		/**
		 * Updates a app by using the AppService save method
		 * @param {Form} [form]
		 */
		function update(form) {
			// refuse to work with invalid data
			if (!vm.app._id || form && !form.$valid) {
				return;
			}

			AppService.update(vm.app)
				.then(updateAppSuccess)
				.catch(updateAppCatch);

			function updateAppSuccess(updatedApp) {
				// update the display name after successful save
				vm.displayName = updatedApp.name;
				Toast.show({text: 'App ' + vm.displayName + ' updated'});
				if (form) {
					form.$setPristine();
				}
			}

			function updateAppCatch(err) {
				Toast.show({
					type: 'warn',
					text: 'Error while updating App ' + vm.displayName,
					link: {state: $state.$current, params: $stateParams}
				});

				if (form && err) {
					form.setResponseErrors(err.data);
				}
			}
		}

		/**
		 * Show a dialog to ask the app if she wants to delete the current selected app.
		 * @param {AngularForm} form - The form to pass to the remove handler
		 * @param {$event} ev - The event to pass to the dialog service
		 */
		function remove(form, ev) {
			var confirm = $mdDialog.confirm()
				.title('Delete app ' + vm.displayName + '?')
				.content('Do you really want to delete app ' + vm.displayName + '?')
				.ariaLabel('Delete app')
				.ok('Delete app')
				.cancel('Cancel')
				.targetEvent(ev);

			$mdDialog.show(confirm)
				.then(performRemove);

			/**
			 * Removes a app by using the AppService remove method
			 * @api private
			 */
			function performRemove() {
				AppService.remove(vm.app)
					.then(deleteAppSuccess)
					.catch(deleteAppCatch);

				function deleteAppSuccess() {
					Toast.show({type: 'success', text: 'App ' + vm.displayName + ' deleted'});
					vm.showList();
				}

				function deleteAppCatch(err) {
					Toast.show({
						type: 'warn',
						text: 'Error while deleting app ' + vm.displayName,
						link: {state: $state.$current, params: $stateParams}
					});

					if (form && err) {
						form.setResponseErrors(err, vm.errors);
					}
				}
			}
		}
	}
})();
