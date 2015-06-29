(function () {
	'use strict';

	/**
	 * Register the list controller as AppMainController
	 */

	angular
		.module('austackApp.app.main')
		.controller('AppMainController', AppMainController);

	// add AppMainController dependencies to inject
	AppMainController.$inject = ['$state'];

	/**
	 * AppMainController constructor
	 */
	function AppMainController($state) {
		var vm = this;
		// switch to the list state
		vm.showList = showList;

		/**
		 * Activate the app.list state
		 */
		function showList() {
			$state.go('app.list');
		}
	}

})();
