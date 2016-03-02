/**
 * Module for handling appUser requests.
 * Initializing the [AppUserController]{@link appUser:controller~AppUserController}
 * and configuring the express router to handle the appUser api
 * for /api/appUsers routes. All Routes are registered after the
 * [request parameters]{@link appUser:parameters} have been
 * added to the router instance.
 * Exports the configured express router for the appUser api routes
 * @module {express.Router} appUser
 * @requires {@link module:middleware}
 * @requires {@link appUser:controller~AppUserController}
 */
'use strict';

var router = require('express').Router();
var contextService = require('request-context');
var middleware = require('../../common/responses');
var AppUserController = require('./appUser.controller');
var auth = require('../../lib/auth/auth.service');

// Export the configured express router for the appUser api routes
module.exports = router;

/**
 * The api controller
 * @type {appUser:controller~AppUserController}
 */
var controller = new AppUserController(router);

// register appUser route parameters, uncomment if needed
// var registerAppUserParameters = require('./appUser.params');
// registerAppUserParameters(router);

// add context for auth sensitive resources
var addRequestContext = contextService.middleware('request');

// add the authenticated user to the created acl context
var addUserContext = auth.addAuthContext('request:acl.user');

// check if the request is made by an authenticated user with at least the appAdmin role
var isAuthenticated = auth.hasRole('appAdmin');

// apply auth middleware to all routes
router.route('*').all(addRequestContext, isAuthenticated, addUserContext);

// register appUser routes
router.route('/')
	.get(controller.index)
	.post(controller.create);

router.route('/' + controller.paramString)
	.get(controller.show)
	.delete(controller.destroy)
	.put(controller.update)
	.patch(controller.update);
