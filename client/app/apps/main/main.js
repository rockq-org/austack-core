(function () {
	'use strict';

	/**
	 * Introduce the austackApp.app.main module
	 * and configure it.
	 *
	 * @requires ui.router
	 * @requires austackApp.mainMenu
	 */

	angular
		.module('austackApp.app.main', [
			'ui.router',
			'austackApp.mainMenu'
		])
		.config(configAppMainRoutes);

	// inject configAppMainRoutes dependencies
	configAppMainRoutes.$inject = ['$stateProvider', 'mainMenuProvider'];

	/**
	 * Route configuration function configuring the passed $stateProvider.
	 * Register the app.main state with the list template for the
	 * 'main' view paired with the AppMainController as 'main'.
	 *
	 * @param {$stateProvider} $stateProvider - The state provider to configure
	 * @param {mainMenuProvider} mainMenuProvider - The service to pass navigation information to
	 */
	function configAppMainRoutes($stateProvider, mainMenuProvider) {
		// The main state configuration
		var mainState = {
			name: 'app.main',
			parent: 'app',
			url: '/',
			authenticate: true,
			role: 'admin',
			views: {
				'@app': {
					templateUrl: 'app/apps/main/main.html',
					controller: 'AppMainController',
					controllerAs: 'main'
				}
			}
		};

		$stateProvider.state(mainState);

		mainMenuProvider.addMenuItem({
			name: 'Apps',
			state: mainState.name,
			role: 'admin'
		});
	}

})();
