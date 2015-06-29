(function () {
	'use strict';

	/**
	 * Register the list controller as AppListController
	 */
	angular
		.module('austackApp.app.list')
		.controller('AppListController', AppListController);

	// add AppListController dependencies to inject
	AppListController.$inject = ['$scope', 'socket', '$state', 'apps', 'ToggleComponent'];

	/**
	 * AppListController constructor
	 *
	 * @param {Object} $scope - The current scope
	 * @param {Object} socket - The socket service to register to
	 * @param {$state} $state - The $state to activate routing states on
	 * @param {Array} apps - The list of apps resolved for this route
	 * @param {Service} ToggleComponent - The service for switching the detail view
	 */
	function AppListController($scope, socket, $state, apps, ToggleComponent) {
		var vm = this;

		// the array of apps
		vm.apps = apps;
		// toggle detail view
		vm.toggleDetails = toggleDetails;

		// initialize the controller
		activate();

		/**
		 * Register socket updates and unsync on scope $destroy event
		 */
		function activate() {
			socket.syncUpdates('app', vm.apps);
			$scope.$on('$destroy', unsyncAppUpdates);

			function unsyncAppUpdates() {
				socket.unsyncUpdates('app');
			}
		}

		/**
		 * Toggle the detail view
		 */
		function toggleDetails() {
			ToggleComponent('app.detailView').toggle();
		}
	}

})();
