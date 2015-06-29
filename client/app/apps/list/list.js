(function () {
	'use strict';

	/**
	 * Introduce the austackApp.app.list module
	 * and configure it.
	 * @requires ui.router
	 * @requires ngMaterial
	 * @requires austackApp.socket
	 * @requires austackApp.mainMenu,
	 * @requires austackApp.toggleComponent,
	 * @requires austackApp.app.list.detail
	 * @requires austackApp.app.list.edit
	 * @requires austackApp.app.list.items
	 */

	angular
		.module('austackApp.app.list', [
			'ngMaterial',
			'ui.router',
			'austackApp.socket',
			'austackApp.mainMenu',
			'austackApp.toggleComponent',
			'austackApp.app.list.detail',
			'austackApp.app.list.edit',
			'austackApp.app.list.items'
		])
		.config(configAppListRoutes);

	// inject configAppListRoutes dependencies
	configAppListRoutes.$inject = ['$stateProvider', 'mainMenuProvider'];

	/**
	 * Route configuration function configuring the passed $stateProvider.
	 * Register the app.list state with the list template fpr the
	 * 'main' view paired with the AppListController as 'list'.
	 *
	 * @param {$stateProvider} $stateProvider - The state provider to configure
	 */
	function configAppListRoutes($stateProvider, mainMenuProvider) {
		// The list state configuration
		var listState = {
			name: 'app.list',
			parent: 'app',
			url: '/list',
			authenticate: true,
			role: 'admin',
			resolve: {
				apps:  resolveApps
			},
			views: {

				// target the unnamed view in the app state
				'@app': {
					templateUrl: 'app/apps/list/list.html',
					controller: 'AppListController',
					controllerAs: 'list'
				},

				// target the content view in the app.list state
				'content@app.list': {
					templateUrl: 'app/apps/list/items/items.html',
					controller: 'AppItemsController',
					controllerAs: 'items'
				}
			}
		};

		$stateProvider.state(listState);

		mainMenuProvider.addSubMenuItem('app.main', {
			name: 'Apps List',
			state: listState.name
		});
	}

	// inject resolveApps dependencies
	resolveApps.$inject = ['App'];

	/**
	 * Resolve dependencies for the app.list state
	 *
	 * @params {App} App - The service to query apps
	 * @returns {Promise} A promise that, when fullfilled, returns an array of apps
	 */
	function resolveApps(App) {
		return App.query().$promise;
	}

})();
