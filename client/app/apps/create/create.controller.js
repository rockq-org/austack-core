/**
 * @ngdoc controller
 * @name austackApp.app.create.controller:AppCreateController
 * @description
 * Controller of the app create page of the admin section
 */

(function () {
	'use strict';

	/**
	 * Register the create controller as AppCreateController
	 */

	angular
		.module('austackApp.app.create')
		.controller('AppCreateController', AppCreateController);

	/**
	 * @ngdoc function
	 * @name austackApp.app.create.provider:AppCreateController
	 * @description
	 * Provider of the {@link austackApp.app.create.controller:AppCreateController AppCreateController}
	 *
	 * @param {Service} Auth The Auth service to use
	 * @param {Service} $mdDialog The mdDialog service to use
	 * @param {Service} App The App resource
	 * @param {Service} AppService The App service to use
	 * @param {Service} Toast The Toast service to use
	 * @returns {Service} {@link austackApp.app.create.controller:AppCreateController AppCreateController}
	 */

	AppCreateController.$inject = ['$mdDialog', 'App', 'AppService', 'Toast'];

	function AppCreateController($mdDialog, App, AppService, Toast) {
		var vm = this;

		/**
		 * @ngdoc property
		 * @name app
		 * @propertyOf austackApp.app.create.controller:AppCreateController
		 * @description
		 * The new app data
		 *
		 * @returns {Object} The app data
		 */
		vm.app = new App();

		// view model bindings (documented below)
		vm.create = createApp;
		vm.close = hideDialog;
		vm.cancel = cancelDialog;

		/**
		 * @ngdoc function
		 * @name createApp
		 * @methodOf austackApp.app.create.controller:AppCreateController
		 * @description
		 * Create a new app by using the AppService create method
		 *
		 * @param {form} [form] The form to gather the information from
		 */
		function createApp(form) {
			// refuse to work with invalid data
			if (vm.app._id || (form && !form.$valid)) {
				return;
			}

			AppService.create(vm.app)
				.then(createAppSuccess)
				.catch(createAppCatch);

			function createAppSuccess(newApp) {
				Toast.show({
					type: 'success',
					text: 'App ' + newApp.name + ' has been created',
					link: {state: 'app.list.detail', params: {id: newApp._id}}
				});
				vm.close();
			}

			function createAppCatch(err) {
				if (form && err) {
					form.setResponseErrors(err);
				}

				Toast.show({
					type: 'warn',
					text: 'Error while creating a new App'
				});
			}
		}

		/**
		 * @ngdoc function
		 * @name hide
		 * @methodOf austackApp.app.create.controller:AppCreateController
		 * @description
		 * Hide the dialog
		 */
		function hideDialog() {
			$mdDialog.hide();
		}

		/**
		 * @ngdoc function
		 * @name cancel
		 * @methodOf austackApp.app.create.controller:AppCreateController
		 * @description
		 * Cancel the dialog
		 */
		function cancelDialog() {
			$mdDialog.cancel();
		}
	}
})();
