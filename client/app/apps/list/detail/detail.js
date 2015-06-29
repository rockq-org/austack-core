(function () {
	'use strict';

	/**
	 * Introduce the austackApp.app.list.detail submodule
	 * and configure it.
	 *
   * @requires ui.router
	 * @requires angularMoment
	 */

	angular
		.module('austackApp.app.list.detail', [
			'ui.router',
			'angularMoment'
		])
		.config(configureAppListDetail);

	// inject configAppRoutes dependencies
	configureAppListDetail.$inject = ['$stateProvider'];

	/**
	 * Route configuration function configuring the passed $stateProvider.
	 * Register the 'app.detail' state with the detail template
	 * paired with the AppDetailController as 'detail' for the
	 * 'sidenav' sub view.
	 * 'app' is resolved as the app with the id found in
	 * the state parameters.
	 *
	 * @param {$stateProvider} $stateProvider - The state provider to configure
	 */
	function configureAppListDetail($stateProvider) {
		// The detail state configuration
		var detailState = {
			name: 'app.list.detail',
			parent: 'app.list',
			url: '/:id',
			authenticate: true,
			role: 'admin',
			onEnter: onEnterAppListDetail,
			views: {
				'detail@app.list': {
					templateUrl: 'app/apps/list/detail/detail.html',
					controller: 'AppDetailController',
					controllerAs: 'detail',
					resolve: {app: resolveAppFromArray}
				}
			}
		};

		$stateProvider.state(detailState);
	}

	// inject onAppListDetailEnter dependencies
	onEnterAppListDetail.$inject = ['$timeout', 'ToggleComponent'];

	/**
	 * Executed when entering the app.list.detail state. Open the component
	 * registered with the component id 'app.detailView'.
	 *
 	 * @params {$timeout} $timeout - The $timeout service to wait for view initialization
	 * @params {ToggleComponent} ToggleComponent - The service to toggle the detail view
	 */
	function onEnterAppListDetail($timeout, ToggleComponent) {
		$timeout(showDetails, 0, false);

		function showDetails() {
			ToggleComponent('app.detailView').open();
		}
	}

	// inject resolveAppFromArray dependencies
	resolveAppFromArray.$inject = ['apps', '$stateParams', '_'];

	/**
	 * Resolve dependencies for the app.detail state
	 *
	 * @params {Array} apps - The array of apps
	 * @params {Object} $stateParams - The $stateParams to read the app id from
	 * @returns {Object|null} The app whose value of the _id property equals $stateParams._id
	 */
	function resolveAppFromArray(apps, $stateParams, _) {
		return _.find(apps, {'_id': $stateParams.id});
	}

})();
