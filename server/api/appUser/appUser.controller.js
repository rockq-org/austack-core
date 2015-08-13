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
    logger.log(req.userInfo);
  }
};

// inherit from ParamController
AppUserController.prototype = _.create(ParamController.prototype, AppUserController.prototype);

var Helper = {

};