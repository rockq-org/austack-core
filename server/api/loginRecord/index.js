/**
 * Module for handling loginRecord requests.
 * Initializing the [LoginRecordController]{@link loginRecord:controller~LoginRecordController}
 * and configuring the express router to handle the loginRecord api
 * for /api/loginRecords routes. All Routes are registered after the
 * [request parameters]{@link loginRecord:parameters} have been
 * added to the router instance.
 * Exports the configured express router for the loginRecord api routes
 * @module {express.Router} loginRecord
 * @requires {@link module:middleware}
 * @requires {@link loginRecord:controller~LoginRecordController}
 */
'use strict';

var router = require('express').Router();
var contextService = require('request-context');
var middleware = require('../../lib/middleware');
var LoginRecordController = require('./loginRecord.controller');
var auth = require('../../lib/auth/auth.service');

// Export the configured express router for the loginRecord api routes
module.exports = router;

/**
 * The api controller
 * @type {loginRecord:controller~LoginRecordController}
 */
var controller = new LoginRecordController(router);

// register loginRecord route parameters, uncomment if needed
// var registerLoginRecordParameters = require('./loginRecord.params');
// registerLoginRecordParameters(router);

// add context for auth sensitive resources
var addRequestContext = contextService.middleware('request');

// add the authenticated user to the created acl context
var addUserContext = auth.addAuthContext('request:acl.user');

// check if the request is made by an authenticated user with at least the admin role
var isAuthenticated = auth.hasRole('admin');
var isAppAdmin = auth.hasRole('appAdmin');

router.route('/validateJwt')
  .post(isAppAdmin, controller.validateJwt);

// apply auth middleware to all routes
router.route('*').all(addRequestContext, isAuthenticated, addUserContext);

// register loginRecord routes
router.route('/')
  .get(controller.index)
  .post(controller.create);

router.route('/' + controller.paramString)
  .get(controller.show)
  .delete(controller.destroy)
  .put(controller.update)
  .patch(controller.update);