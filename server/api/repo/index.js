/**
 * abstract methods to management repo
 * @type {[type]}
 */
'use strict';
var router = require('express').Router();
var contextService = require('request-context');
var middleware = require('../../common/responses');
var RepoController = require('./repo.controller');
var auth = require('../../permission/auth.service');

// Export the configured express router for the application api routes
module.exports = router;

/**
 * The api controller
 * @type {repo:controller~RepoController}
 */
var controller = new RepoController(router);

// add context for auth sensitive resources
var addRequestContext = contextService.middleware('request');

// add the authenticated user to the created acl context
var addUserContext = auth.addAuthContext('request:acl.user');

// check if the request is made by an authenticated user with at least the admin role
var isAuthenticated = auth.hasRole('appAdmin');

// apply auth middleware to all routes
router.route('*').all(addRequestContext, isAuthenticated, addUserContext);

// register application routes
router.route('/')
  .get(controller.index);

router.route('/:repoName')
  // create new record in a specific repo by name
  .post(controller.post)
  // query records in a specific repo by name
  .get(controller.get);

router.route('/:repoName/:uid')
  // update a record in a specific repo by uid
  .put(controller.put)
  .get(controller.get)
  // delete a record in a specific repo by uid
  .delete(controller.delete);
