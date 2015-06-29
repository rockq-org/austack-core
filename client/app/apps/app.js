(function () {
	'use strict';

	/**
	 * Introduce the austackApp.app module
	 * and configure it.
	 *
	 * @requires ui.router
	 * @requires ngResource
	 * @requires austackApp.app.main
	 * @requires austackApp.app.list
	 * @requires austackApp.app.create
	 */
	angular
		.module('austackApp.app', [
			'ngResource',
			'ui.router',
			'austackApp.app.main',
			'austackApp.app.list',
			'austackApp.app.create'
		])
		.config(configAppRoutes);

	// inject configAppRoutes dependencies
	configAppRoutes.$inject = ['$urlRouterProvider', '$stateProvider'];

	/**
	 * Route configuration function configuring the passed $stateProvider.
	 * Register the abstract app state with the app template
	 * paired with the AppController as 'index'.
	 * The injectable 'apps' is resolved as a list of all apps
	 * and can be injected in all sub controllers.
	 *
	 * @param {$stateProvider} $stateProvider - The state provider to configure
	 */
	function configAppRoutes($urlRouterProvider, $stateProvider) {
		// The app state configuration
		var appState = {
			name: 'app',
			url: '/apps',
			abstract: true,
			templateUrl: 'app/apps/app.html',
			controller: 'AppController',
			controllerAs: 'index'
		};

		$urlRouterProvider.when('/app', '/app/');
		$stateProvider.state(appState);
	}

})();
