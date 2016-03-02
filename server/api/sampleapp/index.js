/**
 * abstract methods to management repo
 * @type {[type]}
 */
'use strict';
var router = require('express').Router();
var contextService = require('request-context');
var middleware = require('../../common/responses');
var proxy = require('./sampleapp.proxy');
var auth = require('../../permission/auth.service');

// Export the configured express router for the application api routes
module.exports = router;

// add context for auth sensitive resources
var addRequestContext = contextService.middleware('request');

// add the authenticated user to the created acl context
var addUserContext = auth.addAuthContext('request:acl.user');

// check if the request is made by an authenticated user with at least the admin role
var isAuthenticated = auth.hasRole('admin');

// apply auth middleware to all routes
router.route('*').all(addRequestContext, isAuthenticated, addUserContext);

router.route('/:appId/:type')
  // query records in a specific repo by name
  .get(proxy.download);
