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
        d.resolve(application.repoName);

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

    // RepoProxy.getRepo({
    //     ownerId: ownerId // query by ownerId is enough, as the jwt can not be modify or it will not pass validate
    //   })
    //   .then(function (repoModel) {
    //     repoModel.findOne({
    //       mobile: mobile
    //     }, function (err, user) {
    //       if (user) {
    //         //current mobile exist, can not create
    //         return res.forbidden({
    //           message: 'mobile exist'
    //         });
    //       }

    //       user = {
    //         mobile: mobile,
    //         uid: shortid.generate()
    //       };
    //       repoModel.create(user, function (err, _user) {
    //         if (err) {
    //           logger.log(err);
    //           return res.forbidden({
    //             message: 'error while repoModel.create'
    //           });
    //         }
    //         logger.log(_user, repoModel.modelName);
    //         return res.json(_user);
    //       });
    //     });
    //   });
  }
};

// inherit from ParamController
AppUserController.prototype = _.create(ParamController.prototype, AppUserController.prototype);

var Helper = {

};