/**
 * Controller of repo to process req and res
 */

'use strict';

module.exports = RepoController;

var _ = require('lodash');
var ParamController = require('../../lib/controllers/param.controller');
var roles = require('../../lib/auth/roles');
var User = require('../user/user.model').model;

/**
 * RepoController constructor
 * @classdesc Controller that handles /api/repos route requests
 * for the repo api.
 * Uses the 'repoId' parameter and the 'repoParam' request property
 * to operate with the [main repo API Model]{@link repo:model~Repo} model.
 * @constructor
 * @inherits ParamController
 * @see application:model~Repo
 */
function RepoController(router) {

  // modify select only properties
  // this.select = ['-__v'];

  // omit properties on update
  // this.omit = ['hashedPassword'];

  // property to return (maybe a virtual getter of the model)
  // this.defaultReturn = 'profile';
}

// define properties for the ApplicationController here
RepoController.prototype = {

  /**
   * Set our own constructor property for instanceof checks
   * @private
   */
  constructor: RepoController,

  index: function (req, res) {
    // {"_id":"5596b9bd30e816d8f84bba33","role":"admin","iat":1436510300,"exp":1436528300}
    // logger.debug('get req.user %j', req.user);
    if (req.userInfo.repos && req.userInfo.repos.length > 0) {
      res.json({
        rc: 1,
        data: req.userInfo.repos
      });
    } else {
      res.json({
        rc: 0,
        data: 'User does not have any repo yet.'
      });
    }
  }
}
