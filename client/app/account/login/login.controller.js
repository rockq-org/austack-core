/**
 * @ngdoc controller
 * @name austackApp.account.controller:LoginController
 * @description
 * Controller for the login page
 */

(function () {
	'use strict';

	// register the controller as LoginController
	angular
		.module('austackApp.account')
		.controller('LoginController', LoginController);


	/**
	 * @ngdoc function
	 * @name austackApp.account.provider:LoginController
	 * @description
	 * Provider of the {@link austackApp.account.controller:LoginController LoginController}
	 *
	 * @param {Service} Auth The Auth service to use
	 * @param {Service} $location The location service to use
	 * @returns {Service} {@link austackApp.account.controller:LoginController LoginController}
	 */

	LoginController.$inject = ['Auth', '$location'];

	function LoginController(Auth, $location) {
		var vm = this;

		// view model bindings
		/**
		 * @ngdoc property
		 * @name user
		 * @propertyOf austackApp.account.controller:LoginController
		 * @description
		 * The user data to use as login
		 *
		 * @returns {User} The user data
		 */
		vm.user = {};

		/**
		 * @ngdoc property
		 * @name error
		 * @propertyOf austackApp.account.controller:LoginController
		 * @description
		 * Error flag
		 * @returns {Boolean} True if there is an error
		 */
		vm.error = false;

		// Login function (documented below)
		vm.login = login;

		/**
		 * @ngdoc function
		 * @name login
		 * @methodOf austackApp.account.controller:LoginController
		 * @description
		 * Function to use as submit for the login form
		 * @param {form} form The form to fetch the data from
		 */
		function login(form) {
			if (form.$valid) {
				Auth.login({
					customerId: vm.user.customerId,
					name: vm.user.name,
					password: vm.user.password
				}).then(function () {
					// Logged in, redirect to home
					$location.path('/');
				}).catch(function (err) {
					vm.error = err;
				});
			}
		}
	}

})();
