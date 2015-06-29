/**
 * Module for the controller definition of the app api.
 * The AppController is handling /api/apps requests.
 * @module {app:controller~AppController} app:controller
 * @requires {@link ParamController}
 */
'use strict';

module.exports = AppController;

var ParamController = require('../../lib/controllers/param.controller');

/**
 * The App model instance
 * @type {app:model~App}
 */
var App = require('./app.model').model;

/**
 * AppController constructor
 * @classdesc Controller that handles /api/apps route requests
 * for the app api.
 * Uses the 'appId' parameter and the 'appParam' request property
 * to operate with the [main app API Model]{@link app:model~App} model.
 * @constructor
 * @inherits ParamController
 * @see app:model~App
 */
function AppController(router) {
	ParamController.call(this, App,  router);

	// modify select only properties
	// this.select = ['-__v'];

	// omit properties on update
	// this.omit = ['hashedPassword'];

	// property to return (maybe a virtual getter of the model)
	// this.defaultReturn = 'profile';
}

// define properties for the AppController here
AppController.prototype = {

	/**
	 * Set our own constructor property for instanceof checks
	 * @private
	 */
	constructor: AppController

};

// inherit from ParamController
AppController.prototype = Object.create(ParamController.prototype);

