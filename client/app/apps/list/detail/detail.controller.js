(function () {
	'use strict';

	/**
	 * Register the edit controller as AppDetailController
 	 */

	angular
		.module('austackApp.app.list.detail')
		.controller('AppDetailController', AppDetailController);

	// add AppDetailController dependencies to inject
	AppDetailController.$inject = ['$state', 'app'];

	/**
	 * AppDetailController constructor
	 */
	function AppDetailController($state, app) {
		var vm = this;

		// the current app to display
		vm.app = app;
		// switch to the edit state
		vm.edit = edit;
		// switch to the parent state
		vm.goBack = goBack

		/**
		 * Open the edit state with the current app
		 *
		 */
		function edit() {
			$state.go('^.edit', {'id': vm.app._id});
		}

		/**
		 * Return to the parent state
		 *
		 */
		function goBack() {
			$state.go('^');
		}
	}
})();
