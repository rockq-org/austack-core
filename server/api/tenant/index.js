/**
 * Module for handling tenant requests.
 * Initializing the [TenantController]{@link tenant:controller~TenantController}
 * and configuring the express router to handle the tenant api
 * for /api/tenants routes. Authentication middleware is added to
 * all requests except the '/' route - where everyone can POST to.
 * Export the configured express router for the tenant api routes
 * @module {express.Router}
 * @requires {request-context}
 * @requires {@link tenant:controller}
 * @requires {@link auth:service}
 */
'use strict';

var router = require('express').Router();
var contextService = require('request-context');
var TenantController = require('./tenant.controller');
var auth = require('../../lib/auth/auth.service');

// Export the configured express router for the tenant api routes
module.exports = router;

/**
 * The api controller
 * @type {tenant:controller~TenantController}
 */
var controller = new TenantController(router);

// add context for auth sensitive resources
var addRequestContext = contextService.middleware('request');

// add the authenticated tenant to the created request context
var addTenantContext = auth.addAuthContext('request:acl.tenant');

// check if the used is authenticated at all
var isAuthenticated = auth.isAuthenticated();

// check if the authenticated tenant has at least the 'admin' role
var isAdmin = auth.hasRole('admin');

// create
router.route('/')
  .post(controller.create);
// verifyMobile
router.route('/' + controller.paramString + '/verifyMobile')
  .put(controller.verifyMobile);
// submitUserDetail
router.route('/' + controller.paramString + '/submitUserDetail')
  .put(controller.submitUserDetail);



return; // do not run below code

// wrap in domain, check authentication and attach tenantInfo object, set tenant request context
// router.route('*')
// .all(addRequestContext, isAuthenticated, addTenantContext);

// register tenant routes
router.route('/')
  .get(isAdmin, controller.index)
  // .post(isAdmin, controller.create);
  .post(controller.create);

// fetch authenticated tenant info
router.route('/me')
  .get(controller.me);

// tenant crud routes
router.route('/' + controller.paramString)
  .get(isAdmin, controller.show)
  .delete(isAdmin, controller.destroy)
  .put(isAdmin, controller.update)
  .patch(isAdmin, controller.update);

// set the password for a tenant
router.route('/' + controller.paramString + '/password')
  .put(controller.changePassword)
  .patch(controller.changePassword);

// admin only - administrative tasks for a tenant resource (force set password)
router.route('/' + controller.paramString + '/admin')
  .put(isAdmin, controller.setPassword)
  .patch(isAdmin, controller.setPassword);
