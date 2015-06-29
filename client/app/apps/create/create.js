(function () {
	'use strict';

	/**
	 * Introduce the austackApp.app.create module
	 * and configure it.
	 *
	 * @requires ui.router
	 * @requires ngMessages
	 * @requires ngMaterial
	 * @requires {austackApp.mongooseError}
	 * @requires {austackApp.remoteUnique}
	 * @requires {austackApp.app.service}
	 */

	angular
		.module('austackApp.app.create', [
			'ui.router',
			'ngMessages',
			'ngMaterial',
			'austackApp.mongooseError',
			'austackApp.remoteUnique',
			'austackApp.app.service'
		])
		.config(configureAppCreateRoutes);

	// inject configApp.CreateRoutes dependencies
	configureAppCreateRoutes.$inject = ['$stateProvider'];

	/**
	 * Route configuration function configuring the passed $stateProvider.
	 * Register the 'app.list.create' state. The onEnterAppListCreateView
	 * function will be called when entering the state and open a modal dialog
	 * with the app/apps/create/create.html template loaded.
	 *
	 * @param {$stateProvider} $stateProvider - The state provider to configure
	 */
	function configureAppCreateRoutes($stateProvider) {
		var  createListState = {
			name: 'app.list.create',
			parent: 'app.list',
			url: '/create',
			authenticate: true,
			role: 'admin',
			onEnter: onEnterAppListCreateView
		};

		$stateProvider.state(createListState);
	}

	/**
	 * Function that executes when entering the app.list.create state.
	 * Open the create dialog
	 */

	onEnterAppListCreateView.$inject = ['$rootScope', '$state', '$mdDialog'];

	function onEnterAppListCreateView($rootScope, $state, $mdDialog) {
		var unregisterListener = $rootScope.$on('$stateChangeStart', onStateChange);

		$mdDialog.show({
			controller: 'AppCreateController',
			controllerAs: 'create',
			templateUrl: 'app/apps/create/create.html',
			clickOutsideToClose: false
		}).then(transitionTo, transitionTo);

		/**
		 * Function executed when resolving or rejecting the
		 * dialog promise.
		 *
		 * @param {*} answer - The result of the dialog callback
		 * @returns {promise}
		 */
		function transitionTo(answer) {
			return $state.transitionTo('app.list');
		}

		/**
		 * Function executed when changing the state.
		 * Closes the create dialog
		 */
		function onStateChange() {
			unregisterListener();
			$mdDialog.hide();
		}
	}

})();
