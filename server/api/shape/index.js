/**
 * abstract methods to management Shape
 * @type {[type]}
 */
'use strict';
var router = require('express').Router();
var contextService = require('request-context');
var middleware = require('../../common/responses');
var ShapeController = require('./shape.controller');
var auth = require('../../permission/auth.service');

// Export the configured express router for the shape api routes
module.exports = router;

/**
 * The api controller
 * @type {shape:controller~ShapeController}
 */
var controller = new ShapeController(router);

// add context for auth sensitive resources
var addRequestContext = contextService.middleware('request');

// add the authenticated user to the created acl context
var addUserContext = auth.addAuthContext('request:acl.user');

// check if the request is made by an authenticated user with at least the admin role
var isAuthenticated = auth.hasRole('admin');

// apply auth middleware to all routes
router.route('*').all(addRequestContext, isAuthenticated, addUserContext);

// register application routes controller.paramString = shapeParam
router.route('/:repoName')
  .get(controller.index)
  .put(controller.put);
