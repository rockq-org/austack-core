/**
 * Module for handling tenant requests.
 * Initializing the [TenantController]{@link tenant:controller~TenantController}
 * and configuring the express router to handle the tenant api
 * for /api/tenants routes. All Routes are registered after the
 * [request parameters]{@link tenant:parameters} have been
 * added to the router instance.
 * Exports the configured express router for the tenant api routes
 * @module {express.Router} tenant
 * @requires {@link module:middleware}
 * @requires {@link tenant:controller~TenantController}
 */
'use strict';

var router = require('express').Router();
var contextService = require('request-context');
var middleware = require('../../common/responses');
var TenantController = require('./tenant.controller');
var auth = require('../../permission/auth.service');

// Export the configured express router for the tenant api routes
module.exports = router;

/**
 * The api controller
 * @type {tenant:controller~TenantController}
 */
var controller = new TenantController(router);

// register tenant route parameters, uncomment if needed
// var registerTenantParameters = require('./tenant.params');
// registerTenantParameters(router);

// register tenant routes
// router.route('/')
//  .get(controller.index)
//  .post(controller.create);

router.route('/login')
  .get(controller.loginForm)
  // .get(controller.loginPost)
  .post(controller.loginPost);

// router.route('/signup')
//   .get(controller.signupForm)
//   .post(controller.signupPost);

// router.route('/' + controller.paramString + '/login')
//   .get(controller.loginForm)

// router.route('/' + controller.paramString + '/signup')
//   .get(controller.signupForm)
//   .post(controller.signupPost);

// router.route('/' + controller.paramString + '/reset')
//   .get(controller.resetForm)
//   .post(controller.resetPost);

// router.route('/' + controller.paramString)
//  .get(controller.show)
//  .delete(controller.destroy)
//  .put(controller.update)
//  .patch(controller.update);
