(function () {
	'use strict';

	// register the controller as AppController
	angular
		.module('austackApp.app')
		.controller('AppController', AppController);

	// add AppController dependencies to inject
	// AppController.$inject = [];

	/**
	 * AppController constructor. Main controller for the austackApp.app
	 * module.
	 *
	 * @param {$scope} $scope - The scope to listen for events
	 * @param {socket.io} socket - The socket to register updates
	 */
	function AppController() {
		// var vm = this;
	}

})();
