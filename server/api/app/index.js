/**
 * Module for handling app requests.
 * Initializing the [AppController]{@link app:controller~AppController}
 * and configuring the express router to handle the app api
 * for /api/apps routes. All Routes are registered after the
 * [request parameters]{@link app:parameters} have been
 * added to the router instance.
 * Exports the configured express router for the app api routes
 * @module {express.Router} app
 * @requires {@link module:middleware}
 * @requires {@link app:controller~AppController}
 */
'use strict';

var router = require('express').Router();
var contextService = require('request-context');
var middleware = require('../../lib/middleware');
var AppController = require('./app.controller');
var auth = require('../../lib/auth/auth.service');

// Export the configured express router for the app api routes
module.exports = router;

/**
 * The api controller
 * @type {app:controller~AppController}
 */
var controller = new AppController(router);

// register app route parameters, uncomment if needed
// var registerAppParameters = require('./app.params');
// registerAppParameters(router);

// add context for auth sensitive resources
var addRequestContext = contextService.middleware('request');

// add the authenticated user to the created acl context
var addUserContext = auth.addAuthContext('request:acl.user');

// check if the request is made by an authenticated user with at least the admin role
var isAuthenticated = auth.hasRole('admin');

// apply auth middleware to all routes
router.route('*').all(addRequestContext, isAuthenticated, addUserContext);

// register app routes
router.route('/')
	.get(controller.index)
	.post(controller.create);

router.route('/' + controller.paramString)
	.get(controller.show)
	.delete(controller.destroy)
	.put(controller.update)
	.patch(controller.update);
