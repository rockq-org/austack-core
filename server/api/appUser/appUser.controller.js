/**
 * Module for the controller definition of the appUser api.
 * The AppUserController is handling /api/appUsers requests.
 * @module {appUser:controller~AppUserController} appUser:controller
 * @requires {@link ParamController}
 */
'use strict';

module.exports = AppUserController;

var _ = require('lodash');
var ParamController = require('../../lib/controllers/param.controller');
var RepoProxy = require('../repo/repo.proxy');
var shortid = require('shortid');
var ApplicationModel = require('../application/application.model').model;
var Q = require('q');

/**
 * AppUserController constructor
 * @classdesc Controller that handles /api/appUsers route requests
 * for the appUser api.
 * Uses the 'appUserId' parameter and the 'appUserParam' request property
 * to operate with the [main appUser API Model]{@link appUser:model~AppUser} model.
 * @constructor
 * @inherits ParamController
 * @see appUser:model~AppUser
 */
function AppUserController(router) {
  // ParamController.call(this, AppUser,  router);

  // modify select only properties
  // this.select = ['-__v'];

  // omit properties on update
  // this.omit = ['hashedPassword'];

  // property to return (maybe a virtual getter of the model)
  // this.defaultReturn = 'profile';
}

// define properties for the AppUserController here
AppUserController.prototype = {

  /**
   * Set our own constructor property for instanceof checks
   * @private
   */
  constructor: AppUserController,
  create: function (req, res) {
    var clientId = req.userInfo.clientId;
    var mobile = req.body.mobile;
    if (!mobile) {
      return res.forbidden({
        message: 'missing mobile'
      });
    }

    ApplicationModel.findByClientId(clientId)
      .then(function (application) {
        var d = Q.defer();
        if (application.repoName) {
          d.resolve(application.repoName);
          return d.promise;
        }

        RepoProxy.getRepoName(ownerId)
          .then(function (repoName) {

          });
        return d.promise;
      })
      .then(RepoProxy.getRepoByName)
      .then(function (repoModel) {
        return RepoProxy.createAppUser(repoModel, mobile);
      })
      .then(function (user) {
        logger.log(user);
        return res.json(user);
      })
      .catch(function (err) {
        logger.log(err);
        return res.forbidden({
          message: 'mobile exist'
        });
      });
  }
};

// inherit from ParamController
AppUserController.prototype = _.create(ParamController.prototype, AppUserController.prototype);

var Helper = {

};