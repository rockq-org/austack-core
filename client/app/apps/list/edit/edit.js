(function () {
	'use strict';

	/**
	 * Introduce the austackApp.app.list.edit module
	 * and configure it.
	 *
	 * @requires 'ui.router',
	 * @requires 'ngMaterial',
	 * @requires austackApp.mongooseError
	 * @requires austackApp.app.service
	 */

	angular
		.module('austackApp.app.list.edit', [
			'ui.router',
			'ngMaterial',
			'austackApp.mongooseError',
			'austackApp.app.service'
		])
		.config(configureAppListEdit);

	// inject configAppListEdit dependencies
	configureAppListEdit.$inject = ['$stateProvider'];

	/**
	 * Route configuration function configuring the passed $stateProvider.
	 * Register the app.list.edit state with the edit template
	 * paired with the AppEditController as 'edit' for the
	 * 'detail@app.list' view.
	 * 'app' is resolved as the app with the id found in
	 * the state parameters.
	 *
	 * @param {$stateProvider} $stateProvider - The state provider to configure
	 */
	function configureAppListEdit($stateProvider) {
		// The edit state configuration.
		var editState = {
			name: 'app.list.edit',
			parent: 'app.list',
			url: '/edit/:id',
			authenticate: true,
			role: 'admin',
			onEnter: onEnterAppListEdit,
			views: {
				'detail@app.list': {
					templateUrl: 'app/apps/list/edit/edit.html',
					controller: 'AppEditController',
					controllerAs: 'edit',
					resolve: {app: resolveAppFromArray}
				}
			}
		};

		$stateProvider.state(editState);
	}

	// inject onAppListEditEnter dependencies
	onEnterAppListEdit.$inject = ['$timeout', 'ToggleComponent'];

	/**
	 * Executed when entering the app.list.detail state. Open the component
	 * registered with the component id 'app.detailView'.
	 *
	 * @params {$timeout} $timeout - The $timeout service to wait for view initialization
	 * @params {ToggleComponent} ToggleComponent - The service to toggle the detail view
	 */
	function onEnterAppListEdit($timeout, ToggleComponent) {
		$timeout(showDetails, 0, false);

		function showDetails() {
			ToggleComponent('app.detailView').open();
		}
	}

	// inject resolveAppDetailRoute dependencies
	resolveAppFromArray.$inject = ['apps', '$stateParams', '_'];

	/**
	 * Resolve dependencies for the app.list.edit state. Get the app
	 * from the injected Array of apps by using the '_id' property.
	 *
	 * @params {Array} apps - The array of apps
	 * @params {Object} $stateParams - The $stateParams to read the app id from
	 * @params {Object} _ - The lodash service to find the requested app
	 * @returns {Object|null} The app whose value of the _id property equals $stateParams._id
	 */
	function resolveAppFromArray(apps, $stateParams, _) {
		//	return App.get({id: $stateParams.id}).$promise;
		return _.find(apps, {'_id': $stateParams.id});
	}

})();
