/**
 * Module for handling application requests.
 * Initializing the [ApplicationController]{@link application:controller~ApplicationController}
 * and configuring the express router to handle the application api
 * for /api/applications routes. All Routes are registered after the
 * [request parameters]{@link application:parameters} have been
 * added to the router instance.
 * Exports the configured express router for the application api routes
 * @module {express.Router} application
 * @requires {@link module:middleware}
 * @requires {@link application:controller~ApplicationController}
 */
'use strict';

var router = require('express').Router();
var contextService = require('request-context');
var middleware = require('../../lib/middleware');
var ApplicationController = require('./application.controller');
var auth = require('../../lib/auth/auth.service');

// Export the configured express router for the application api routes
module.exports = router;

/**
 * The api controller
 * @type {application:controller~ApplicationController}
 */
var controller = new ApplicationController(router);

// register application route parameters, uncomment if needed
// var registerApplicationParameters = require('./application.params');
// registerApplicationParameters(router);

// add context for auth sensitive resources
var addRequestContext = contextService.middleware('request');

// add the authenticated user to the created acl context
var addUserContext = auth.addAuthContext('request:acl.user');

// check if the request is made by an authenticated user with at least the admin role
var isAuthenticated = auth.hasRole('admin');

// apply auth middleware to all routes
router.route('*').all(addRequestContext, isAuthenticated, addUserContext);

// register application routes
router.route('/')
  .get(controller.index)
  .post(controller.create);

router.route('/' + controller.paramString)
  .get(controller.show)
  .delete(controller.destroy)
  .put(controller.update)
  .patch(controller.update);
