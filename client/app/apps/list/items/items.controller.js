(function () {
	'use strict';

	/**
	 * Register the list controller as AppItemsController
	 */

	angular
		.module('austackApp.app.list.items')
		.controller('AppItemsController', AppItemsController);

	// add AppItemsController dependencies to inject
	AppItemsController.$inject = ['$state'];

	/**
	 * AppItemsController constructor
	 */
	function AppItemsController($state) {
		var vm = this;

		// the selected item id
		var curAppId = null;

		// check if this item is selected
		vm.isSelected = isSelected;
		// switch to the detail state
		vm.showInDetails = showInDetails;

		/**
		 * Check if the passed item is the current selected item
		 *
		 * @param {Object} app - The object to check for selection
		 */
		function isSelected(app) {
			return curAppId === app._id;
		}

		/**
		 * Open the detail state with the selected item
		 *
		 * @param {Object} app - The app to edit
		 */
		function showInDetails(app) {
			curAppId = app._id;
			$state.go('app.list.detail', {'id': curAppId});
		}
	}

})();
