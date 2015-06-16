	/**
	 * @ngdoc overview
	 * @name austackApp.admin.user.list.items
	 * @requires ui.router
	 * @requires components/listImage
	 *
	 * @description
	 * The `austackApp.admin.user.list.items` module which provides:
	 *
	 * - {@link austackApp.admin.user.list.items.controller:UserItemsController UserItemsController}
	 */

(function () {
	'use strict';

	angular
		.module('austackApp.admin.user.list.items', [
			'ui.router',
			'austackApp.listImage'
		]);

})();
